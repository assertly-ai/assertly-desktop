import { chromium, Browser, Page } from 'playwright-core'

export class PlaywrightAdapter {
  browser: Browser | null = null

  async connect(webSocketDebuggerUrl: string): Promise<void> {
    this.browser = await chromium.connectOverCDP(webSocketDebuggerUrl)
  }

  async getPage(guid: string): Promise<Page | null> {
    if (!this.browser) {
      console.error('browser not found')
      return null
    }
    const pages = this.browser.contexts()[0].pages()
    const guids = await Promise.all(
      pages.map(async (page) => {
        try {
          return await page.evaluate('window.playwright')
        } catch {
          console.error('error while evaluating page')
          return undefined
        }
      })
    )
    const index = guids.findIndex((testGuid) => testGuid === guid)
    return pages[index] || null
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}
