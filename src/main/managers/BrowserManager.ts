import { v4 as uuidv4 } from 'uuid'
import { PlaywrightAdapter } from '../adapters/PlaywrightAdapter'
import { WindowManager } from './WindowManager'

export class BrowserManager {
  constructor(
    private playwrightAdapter: PlaywrightAdapter,
    private windowManager: WindowManager
  ) {}

  async setup(): Promise<void> {
    try {
      if (!this.windowManager.previewWindow) {
        throw new Error('Preview window not found')
      }

      const playwrightPage = await this.getPlaywrightPage(this.windowManager.previewWindow)

      if (playwrightPage) {
        // Use playwrightPage to control the WebContentsView
        await playwrightPage.goto('https://www.google.com')
        await playwrightPage.waitForTimeout(5000)
        await playwrightPage.goto('https://assertly.ai')
      } else {
        console.error('Failed to find the preview window page')
      }
    } catch (e) {
      console.error('Error in setupPlaywright:', e)
    }
  }

  async getPlaywrightPage(window: Electron.WebContentsView) {
    const guid = uuidv4()
    await window.webContents.executeJavaScript(`window.playwright = "${guid}"`)

    const page = await this.playwrightAdapter.getPage(guid)
    // await window.webContents.executeJavaScript('delete window.playwright')

    return page
  }

  async closeBrowser(): Promise<void> {
    await this.playwrightAdapter.closeBrowser()
  }
}
