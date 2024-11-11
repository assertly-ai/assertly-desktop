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

  async executePlaywrightCode(code: string, blockId: number): Promise<unknown> {
    if (!this.windowManager.previewWindow) {
      console.error('Preview window not found')
      throw new Error('Preview window not found')
    }

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

  async closeBrowser(): Promise<void> {
    await this.playwrightAdapter.closeBrowser()
  }
}
