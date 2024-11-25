import { v4 as uuidv4 } from 'uuid'
import { ElementHandle, Locator, Page } from 'playwright'
import { PlaywrightAdapter } from '../adapters/PlaywrightAdapter'
import { WindowManager } from './WindowManager'
import { AriaRole } from '../types/browser'

interface LocatorEntry {
  type: string
  locator: Locator
}

interface AncestryItem {
  tagName: string
  id?: string
  text?: string
  index: number
  attributes?: {
    'aria-label'?: string | null
    'data-testid'?: string | null
  }
}

interface ElementContext {
  element: {
    text?: string
    attributes?: {
      'aria-label'?: string | null
      'data-testid'?: string | null
      type?: string | null
    }
    isVisible?: boolean
    role?: string
    tagName?: string
    id?: string
    value?: string
    type?: string
    ariaLabel?: string
    boundingBox?: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  selector: string
  ancestry: AncestryItem[]
  siblings: {
    before: ElementInfo[]
    after: ElementInfo[]
  }
}

interface ElementInfo {
  tagName: string
  id?: string
  text?: string
  role?: string
  attributes?: {
    'aria-label'?: string | null
    'data-testid'?: string | null
    type?: string | null
  }
}

export class BrowserManager {
  private readonly MAX_ELEMENTS = 3
  private readonly MAX_ANCESTRY_DEPTH = 3
  private readonly MAX_SIBLINGS = 2
  private readonly MAX_TEXT_LENGTH = 100
  private readonly MAX_VALUE_LENGTH = 100

  constructor(
    private playwrightAdapter: PlaywrightAdapter,
    private windowManager: WindowManager
  ) {}

  async getPlaywrightPage(window: Electron.WebContentsView) {
    const guid = uuidv4()
    await window.webContents.executeJavaScript(`window.playwright = "${guid}"`)
    const page = await this.playwrightAdapter.getPage(guid)
    await window.webContents.executeJavaScript('delete window.playwright')
    return page
  }

  async getActivePageScreenshot(): Promise<string | undefined> {
    try {
      const page = await this.getActivePage()
      if (!page) return undefined

      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 80,
        fullPage: false
      })

      return `data:image/jpeg;base64,${screenshot.toString('base64')}`
    } catch (error) {
      console.error('Error taking screenshot:', error)
      return undefined
    }
  }

  async getElementDetails(locator: string): Promise<ElementContext | null> {
    const page = await this.getActivePage()
    if (!page) return null

    try {
      const element = await page.locator(locator).elementHandle()
      if (!element) return null

      const context = await this.createElementContext(element)
      await element.dispose()
      return context
    } catch (error) {
      console.error('Error getting element details:', error)
      return null
    }
  }

  async executePlaywrightCode(code: string, blockId: number): Promise<unknown> {
    if (!this.windowManager.previewWindow) {
      throw new Error('Preview window not found')
    }

    const page = await this.getPlaywrightPage(this.windowManager.previewWindow)
    if (!page) {
      throw new Error('Failed to find the preview window page')
    }

    const sendLog = (log: { type: string; message: unknown[] }) => {
      this.windowManager.mainWindow?.webContents.send('block-log', {
        blockId,
        log: {
          ...log,
          id: uuidv4()
        }
      })
    }

    const executeCode = new Function(
      'page',
      'sendLog',
      `
      return (async () => {
        // Disable strict mode for this execution
        const context = page.context();
        await context.setDefaultNavigationTimeout(30000);
        context.setDefaultTimeout(30000);

        const originalConsole = { ...console };
        console.log = (...args) => {
          sendLog({ type: 'log', message: args });
          originalConsole.log(...args);
        };
        console.error = (...args) => {
          sendLog({ type: 'error', message: args });
          originalConsole.error(...args);
        };
        console.warn = (...args) => {
          sendLog({ type: 'warn', message: args });
          originalConsole.warn(...args);
        };
        console.info = (...args) => {
          sendLog({ type: 'info', message: args });
          originalConsole.info(...args);
        };

        try {
          const result = await (async () => {
            ${code}
          })();
          return result;
        } catch (error) {
          sendLog({ type: 'error', message: [error.message] });
          throw error;
        } finally {
          Object.assign(console, originalConsole);
        }
      })();
    `
    )

    try {
      return await executeCode(page, sendLog)
    } catch (error) {
      console.error('Error executing Playwright code:', error)
      throw error
    }
  }
  async findElement(options: {
    strategy: 'text' | 'role' | 'testid' | 'label' | 'complex'
    query: string
    nearText?: string
    index?: number
  }): Promise<ElementContext[]> {
    const page = await this.getActivePage()
    if (!page) throw new Error('No active page')

    await Promise.race([
      page.waitForLoadState('domcontentloaded'),
      new Promise((resolve) => setTimeout(resolve, 3000))
    ])

    console.log('Finding element with options:', options)

    const locators: LocatorEntry[] = this.getLocatorsForStrategy(page, options)
    let foundElements: ElementHandle<Element>[] = []
    let successfulLocator = ''

    for (const { type, locator } of locators) {
      try {
        const count = await locator.count()
        if (count > 0) {
          console.log(`Found ${count} elements with locator type: ${type}`)
          const elements = await locator.elementHandles()
          foundElements = elements as ElementHandle<Element>[]
          successfulLocator = type
          break
        }
      } catch (error) {
        console.log(`Locator ${type} failed:`, error)
        continue
      }
    }

    if (foundElements.length === 0) {
      throw new Error(`No elements found using ${options.strategy}: ${options.query}`)
    }

    if (foundElements.length > 0) {
      foundElements = await this.deduplicateElements(foundElements)
      console.log(`After deduplication: ${foundElements.length} unique elements`)
    }

    if (foundElements.length > this.MAX_ELEMENTS) {
      console.log(`Limiting elements from ${foundElements.length} to ${this.MAX_ELEMENTS}`)
      foundElements = foundElements.slice(0, this.MAX_ELEMENTS)
    }

    if (options.nearText) {
      foundElements = await this.filterByNearText(page, foundElements, options.nearText)
    }

    const elementContexts = await Promise.all(
      foundElements.map(async (element) => {
        try {
          const context = await this.createElementContext(element)
          return context
        } catch (error) {
          console.warn('Error creating element context:', error)
          return null
        }
      })
    )

    await Promise.all(foundElements.map((el) => el.dispose().catch(() => {})))

    const validContexts = elementContexts.filter((ctx): ctx is ElementContext => ctx !== null)
    console.log(`Successfully found ${validContexts.length} elements using ${successfulLocator}`)

    return validContexts
  }

  private async deduplicateElements(
    elements: ElementHandle<Element>[]
  ): Promise<ElementHandle<Element>[]> {
    const uniqueElements = new Map<string, ElementHandle<Element>>()

    for (const element of elements) {
      // Create a unique key based on element properties
      const key = await element.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        return `${el.tagName}_${rect.x}_${rect.y}_${rect.width}_${rect.height}_${el.textContent?.trim()}`
      })

      if (!uniqueElements.has(key)) {
        uniqueElements.set(key, element)
      }
    }

    return Array.from(uniqueElements.values())
  }

  private getLocatorsForStrategy(
    page: Page,
    options: { strategy: string; query: string }
  ): LocatorEntry[] {
    const locators: LocatorEntry[] = []

    switch (options.strategy) {
      case 'text':
        locators.push(
          { type: 'exact text', locator: page.getByText(options.query, { exact: true }) },
          { type: 'partial text', locator: page.getByText(options.query, { exact: false }) },
          { type: 'input value', locator: page.locator(`input[value*="${options.query}"]i`) },
          { type: 'button value', locator: page.locator(`button[value*="${options.query}"]i`) },
          { type: 'placeholder', locator: page.getByPlaceholder(options.query, { exact: false }) },
          { type: 'label text', locator: page.getByLabel(options.query, { exact: false }) },
          { type: 'title', locator: page.locator(`[title*="${options.query}"]i`) },
          { type: 'aria-label', locator: page.getByLabel(options.query, { exact: false }) },
          {
            type: 'text regex',
            locator: page.locator(`text=/(?i)${this.escapeRegExp(options.query)}/`)
          },
          {
            type: 'input contains',
            locator: page.locator('input, textarea, select').filter({ hasText: options.query })
          }
        )
        break

      case 'role':
        locators.push({
          type: 'explicit role',
          locator: page.getByRole(options.query as AriaRole)
        })

        switch (options.query) {
          case 'textbox':
            locators.push(
              { type: 'input text', locator: page.locator('input[type="text"]') },
              { type: 'input search', locator: page.locator('input[type="search"]') },
              { type: 'input email', locator: page.locator('input[type="email"]') },
              { type: 'textarea', locator: page.locator('textarea') },
              { type: 'contenteditable', locator: page.locator('[contenteditable="true"]') }
            )
            break

          case 'button':
            locators.push(
              { type: 'button element', locator: page.locator('button') },
              { type: 'input button', locator: page.locator('input[type="button"]') },
              { type: 'input submit', locator: page.locator('input[type="submit"]') },
              { type: 'role button', locator: page.locator('[role="button"]') },
              { type: 'clickable link', locator: page.locator('a[href]') }
            )
            break

          case 'link':
            locators.push(
              { type: 'anchor', locator: page.locator('a[href]') },
              { type: 'role link', locator: page.locator('[role="link"]') }
            )
            break

          case 'checkbox':
            locators.push(
              { type: 'checkbox input', locator: page.locator('input[type="checkbox"]') },
              { type: 'role checkbox', locator: page.locator('[role="checkbox"]') }
            )
            break

          case 'radio':
            locators.push(
              { type: 'radio input', locator: page.locator('input[type="radio"]') },
              { type: 'role radio', locator: page.locator('[role="radio"]') }
            )
            break
        }
        break

      case 'testid':
        locators.push(
          { type: 'data-testid', locator: page.locator(`[data-testid="${options.query}"]`) },
          { type: 'data-test', locator: page.locator(`[data-test="${options.query}"]`) },
          { type: 'data-qa', locator: page.locator(`[data-qa="${options.query}"]`) },
          { type: 'data-cy', locator: page.locator(`[data-cy="${options.query}"]`) },
          { type: 'id', locator: page.locator(`[id*="${options.query}"]i`) },
          { type: 'name', locator: page.locator(`[name*="${options.query}"]i`) }
        )
        break

      case 'label':
        locators.push(
          { type: 'aria label', locator: page.getByLabel(options.query, { exact: false }) },
          { type: 'label text', locator: page.locator(`label:has-text("${options.query}")`) },
          { type: 'aria-label attr', locator: page.locator(`[aria-label*="${options.query}"]i`) },
          { type: 'title attr', locator: page.locator(`[title*="${options.query}"]i`) },
          { type: 'alt attr', locator: page.locator(`[alt*="${options.query}"]i`) },
          { type: 'label for', locator: page.locator(`label[for*="${options.query}"]i`) },
          {
            type: 'aria-labelledby',
            locator: page.locator(`[aria-labelledby*="${options.query}"]i`)
          },
          {
            type: 'aria-describedby',
            locator: page.locator(`[aria-describedby*="${options.query}"]i`)
          }
        )
        break

      case 'complex':
        locators.push({ type: 'complex', locator: page.locator(options.query) })
        break
    }

    return locators
  }

  private async createElementContext(element: ElementHandle): Promise<ElementContext> {
    return await element.evaluate(
      (el: Element, { maxDepth, maxSiblings, maxTextLength, maxValueLength }) => {
        function getElementInfo(el: Element | null): ElementInfo | null {
          if (!el) return null
          return {
            tagName: el.tagName.toLowerCase(),
            id: el.id || undefined,
            text: el.textContent?.trim()?.substring(0, maxTextLength),
            role: el.getAttribute('role') || undefined,
            attributes: {
              'aria-label': el.getAttribute('aria-label'),
              'data-testid': el.getAttribute('data-testid'),
              type: el.getAttribute('type')
            }
          }
        }

        const ancestry: AncestryItem[] = []
        let current: Element | null = el
        let depth = 0

        while (current && current !== document.body && depth < maxDepth) {
          const parent = current.parentElement
          if (!parent) break

          ancestry.unshift({
            tagName: current.tagName.toLowerCase(),
            id: current.id || undefined,
            text: current.textContent?.trim()?.substring(0, maxTextLength),
            index: Array.from(parent.children).indexOf(current),
            attributes: {
              'aria-label': current.getAttribute('aria-label'),
              'data-testid': current.getAttribute('data-testid')
            }
          })

          current = parent
          depth++
        }

        const siblings = {
          before: [] as ElementInfo[],
          after: [] as ElementInfo[]
        }

        if (el.parentElement) {
          const allSiblings = Array.from(el.parentElement.children)
          const elementIndex = allSiblings.indexOf(el)

          for (let i = Math.max(0, elementIndex - maxSiblings); i < elementIndex; i++) {
            const info = getElementInfo(allSiblings[i])
            if (info) siblings.before.push(info)
          }

          for (
            let i = elementIndex + 1;
            i < Math.min(allSiblings.length, elementIndex + maxSiblings + 1);
            i++
          ) {
            const info = getElementInfo(allSiblings[i])
            if (info) siblings.after.push(info)
          }
        }

        const rect = el.getBoundingClientRect()

        return {
          element: {
            text: el.textContent?.trim()?.substring(0, maxTextLength),
            tagName: el.tagName.toLowerCase(),
            id: el.id || undefined,
            value: (el as HTMLInputElement).value?.substring(0, maxValueLength),
            type: (el as HTMLInputElement).type,
            role: el.getAttribute('role') || undefined,
            ariaLabel: el.getAttribute('aria-label') || undefined,
            isVisible: rect.height > 0 && rect.width > 0,
            attributes: {
              'aria-label': el.getAttribute('aria-label'),
              'data-testid': el.getAttribute('data-testid'),
              type: el.getAttribute('type')
            },
            boundingBox: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            }
          },
          selector: '',
          ancestry,
          siblings
        }
      },
      {
        maxDepth: this.MAX_ANCESTRY_DEPTH,
        maxSiblings: this.MAX_SIBLINGS,
        maxTextLength: this.MAX_TEXT_LENGTH,
        maxValueLength: this.MAX_VALUE_LENGTH
      }
    )
  }

  private async filterByNearText(
    page: Page,
    elements: ElementHandle<Element>[],
    nearText: string
  ): Promise<ElementHandle<Element>[]> {
    const filtered: ElementHandle<Element>[] = []

    for (const element of elements) {
      try {
        const isNear = await page.evaluate(
          ([el, text]) => {
            if (!(el instanceof Element)) return false

            const elRect = el.getBoundingClientRect()
            const center = {
              x: elRect.x + elRect.width / 2,
              y: elRect.y + elRect.height / 2
            }

            const nearbyElements = document
              .elementsFromPoint(center.x, center.y)
              .concat(Array.from(document.elementsFromPoint(center.x - 100, center.y)))
              .concat(Array.from(document.elementsFromPoint(center.x + 100, center.y)))
              .concat(Array.from(document.elementsFromPoint(center.x, center.y - 100)))
              .concat(Array.from(document.elementsFromPoint(center.x, center.y + 100)))

            return nearbyElements.some((ne) =>
              ne.textContent?.toLowerCase().includes(text.toLowerCase())
            )
          },
          [element, nearText] as const
        )

        if (isNear) {
          filtered.push(element)
        }
      } catch (error) {
        console.warn('Error in near-text filtering:', error)
      }
    }
    return filtered
  }

  private async getActivePage() {
    if (!this.windowManager.previewWindow) {
      throw new Error('Preview window not found')
    }
    return await this.getPlaywrightPage(this.windowManager.previewWindow)
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  async closeBrowser(): Promise<void> {
    await this.playwrightAdapter.closeBrowser()
  }
}
