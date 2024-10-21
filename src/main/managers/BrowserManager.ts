import { v4 as uuidv4 } from 'uuid'
import { PlaywrightAdapter } from '../adapters/PlaywrightAdapter'
import { WindowManager } from './WindowManager'

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

  async executePlaywrightCode(code: string): Promise<any> {
    if (!this.windowManager.previewWindow) {
      console.error('Preview window not found')
      throw new Error('Preview window not found')
    }

    const page = await this.getPlaywrightPage(this.windowManager.previewWindow)
    if (!page) {
      console.error('Failed to find the preview window page')
      throw new Error('Failed to find the preview window page')
    }

    const executeCode = new Function(
      'page',
      `
      return (async () => {
        ${code}
      })();
    `
    )

    try {
      return await executeCode(page)
    } catch (error) {
      console.error('Error executing Playwright code:', error)
      throw error
    }
  }

  async closeBrowser(): Promise<void> {
    await this.playwrightAdapter.closeBrowser()
  }
}
