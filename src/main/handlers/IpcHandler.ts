import { ipcMain } from 'electron'
import { WindowManager } from '../managers/WindowManager'
import { BrowserManager } from '../managers/BrowserManager'
import { StorageManager } from '../managers/StorageManager'
export class IpcHandler {
  constructor(
    private windowManager: WindowManager,
    private browserManager: BrowserManager,
    private storageManager: StorageManager
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
        return { success: true, data: result }
      } catch (error: unknown) {
        return { success: false, error: error }
      }
    })

    ipcMain.handle('db-create', async (event, table: string, data: Record<string, unknown>) => {
      const result = await this.storageManager.create(table, data)
      event.sender.send('sync-data', table)
      return result
    })

    ipcMain.handle('db-read', async (_, table: string, id: number) => {
      return this.storageManager.read(table, id)
    })

    ipcMain.handle(
      'db-update',
      async (event, table: string, id: number, data: Record<string, unknown>) => {
        const result = await this.storageManager.update(table, id, data)
        event.sender.send('sync-data', table)
        return result
      }
    )

    ipcMain.handle('db-delete', async (event, table: string, id: number) => {
      const result = await this.storageManager.delete(table, id)
      event.sender.send('sync-data', table)
      return result
    })

    ipcMain.handle('db-list', async (_, table: string, conditions?: Record<string, unknown>) => {
      return this.storageManager.list(table, conditions)
    })
  }
}
