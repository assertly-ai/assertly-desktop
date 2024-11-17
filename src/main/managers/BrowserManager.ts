import { v4 as uuidv4 } from 'uuid'
import { PlaywrightAdapter } from '../adapters/PlaywrightAdapter'
import { WindowManager } from './WindowManager'
import { AccessibilityNode } from '../types/browser'
export class BrowserManager {
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

  async executePlaywrightCode(code: string, blockId: number): Promise<unknown> {
    if (!this.windowManager.previewWindow) {
      console.error('Preview window not found')
      throw new Error('Preview window not found')
    }

    console.log('Code: ', code)

    const page = await this.getPlaywrightPage(this.windowManager.previewWindow)
    if (!page) {
      console.error('Failed to find the preview window page')
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
        const originalConsole = { ...console };

        // Override console methods
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
          // Restore original console
          Object.assign(console, originalConsole);
        }
      })();
    `
    )

    try {
      const result = await executeCode(page, sendLog)
      return result
    } catch (error) {
      console.error('Error executing Playwright code:', error)
      throw error
    }
  }

  async getCurrentPageScreenshot(): Promise<string | null> {
    try {
      const page = await this.getActivePage()
      if (!page) return null

      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 80,
        fullPage: true
      })

      return `data:image/jpeg;base64,${screenshot.toString('base64')}`
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
      return null
    }
  }

  async getAccessibilityTree() {
    const page = await this.getActivePage()
    if (!page) {
      console.error('Failed to find the preview window page')
      throw new Error('Failed to find the preview window page')
    }
    try {
      // Get accessibility snapshot using locator API instead of deprecated accessibility
      const snapshot = await page.evaluate(() => {
        const serializeNode = (node: Element): AccessibilityNode => {
          const role = node.getAttribute('role')
          const name =
            node.getAttribute('aria-label') || node.getAttribute('alt') || node.textContent
          return {
            role: role || undefined,
            name: name || undefined,
            value: node.getAttribute('aria-valuenow') || undefined,
            description: node.getAttribute('aria-description') || undefined,
            properties: {
              disabled: node.getAttribute('aria-disabled'),
              hidden: node.getAttribute('aria-hidden'),
              required: node.getAttribute('aria-required')
            },
            children: Array.from(node.children).map(serializeNode),
            checked: node.getAttribute('aria-checked') === 'true',
            pressed: node.getAttribute('aria-pressed') === 'true',
            expanded: node.getAttribute('aria-expanded') === 'true',
            selected: node.getAttribute('aria-selected') === 'true',
            focused: node === document.activeElement
          }
        }
        return serializeNode(document.body)
      })

      if (!snapshot) {
        throw new Error('Failed to get accessibility snapshot')
      }

      return snapshot
    } catch (error) {
      console.error('Failed to get accessibility tree:', error)
      throw error
    }
  }

  private async getActivePage() {
    if (!this.windowManager.previewWindow) {
      console.error('Preview window not found')
      throw new Error('Preview window not found')
    }
    const page = await this.getPlaywrightPage(this.windowManager.previewWindow)
    return page
  }

  async closeBrowser(): Promise<void> {
    await this.playwrightAdapter.closeBrowser()
  }
}
