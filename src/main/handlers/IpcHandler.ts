import { ipcMain } from 'electron'
import { WindowManager } from '../managers/WindowManager'
import { BrowserManager } from '../managers/BrowserManager'

export class IpcHandler {
  constructor(
    private windowManager: WindowManager,
    private browserManager: BrowserManager
  ) {}

  setupHandlers(): void {
    ipcMain.on('toggle-preview', (_, show: boolean) => {
      this.windowManager.togglePreviewWindow(show)
    })

    ipcMain.on('panel-resized', (_, sizes) => {
      this.windowManager.updatePreviewWindowBounds(sizes[1])
    })

    ipcMain.on('resize-preview', () => {
      this.windowManager.updatePreviewWindowBounds()
    })

    ipcMain.handle('execute-playwright-code', async (_, code: string) => {
      try {
        const result = await this.browserManager.executePlaywrightCode(code)
        return { success: true, result }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
  }
}
