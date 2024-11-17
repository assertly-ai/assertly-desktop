import { ipcMain } from 'electron'
import { WindowManager } from '../managers/WindowManager'
import { BrowserManager } from '../managers/BrowserManager'
import { StorageManager } from '../managers/StorageManager'
import { AgentManager } from '../managers/AgentManager'
export class IpcHandler {
  constructor(
    private windowManager: WindowManager,
    private browserManager: BrowserManager,
    private storageManager: StorageManager,
    private agentManager: AgentManager
  ) {}

  setupHandlers(): void {
    ipcMain.handle('ai-agent:execute-agent', async (_, instruction: string) => {
      await this.agentManager.startInstruction(instruction)
    })

    ipcMain.on('ai-agent:user-response', (_, response: string) => {
      this.agentManager.provideUserResponse(response)
    })

    ipcMain.on('ai-agent:stop-agent', () => {
      this.agentManager.stopExecution()
    })

    ipcMain.on('ai-agent:clear-context', () => {
      this.agentManager.clearAgentContext()
    })

    ipcMain.on('toggle-preview', (_, show: boolean, sizes) => {
      if (Array.isArray(sizes)) {
        this.windowManager.togglePreviewWindow(show, sizes[1])
      } else {
        this.windowManager.togglePreviewWindow(show, sizes)
      }
    })

    ipcMain.on('panel-resized', (_, sizes) => {
      if (Array.isArray(sizes)) {
        this.windowManager.updatePreviewWindowBounds(sizes[1])
      } else {
        this.windowManager.updatePreviewWindowBounds(sizes)
      }
    })

    ipcMain.on('resize-preview', () => {
      this.windowManager.updatePreviewWindowBounds()
    })

    ipcMain.handle('execute-playwright-code', async (_, code: string, blockId: number) => {
      try {
        const result = await this.browserManager.executePlaywrightCode(code, blockId)
        return { success: true, data: result }
      } catch (error: unknown) {
        return { success: false, error: error }
      }
    })

    ipcMain.handle('db-create', async (event, table: string, data: Record<string, unknown>) => {
      const result = this.storageManager.create(table, data)
      event.sender.send('sync-data', table)
      return result
    })

    ipcMain.handle('db-read', async (_, table: string, id: number) => {
      return this.storageManager.read(table, id)
    })

    ipcMain.handle(
      'db-update',
      async (event, table: string, id: number, data: Record<string, unknown>) => {
        const result = this.storageManager.update(table, id, data)
        event.sender.send('sync-data', table)
        return result
      }
    )

    ipcMain.handle(
      'db-update-many',
      async (event, table: string, ids: number[], data: Record<string, unknown>[]) => {
        const result = this.storageManager.updateMany(table, ids, data)
        event.sender.send('sync-data', table)
        return result
      }
    )

    ipcMain.handle('db-delete', async (event, table: string, id: number) => {
      const result = this.storageManager.delete(table, id)
      event.sender.send('sync-data', table)
      return result
    })

    ipcMain.handle('db-list', async (_, table: string, conditions?: Record<string, unknown>) => {
      return this.storageManager.list(table, conditions)
    })
  }
}
