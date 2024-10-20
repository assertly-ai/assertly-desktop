import { ipcMain } from 'electron'
import { WindowManager } from '../managers/WindowManager'

export class IpcHandler {
  constructor(private windowManager: WindowManager) {}

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
  }
}
