import { BaseHandler } from './BaseHandler'
import { StorageManager } from '../managers/StorageManager'

export interface StorageMessage<T = unknown> {
  table: string
  id?: number
  data?: T
  conditions?: Record<string, unknown>
}

export class StorageHandler extends BaseHandler {
  constructor(private storageManager: StorageManager) {
    super()
  }

  setup(): void {
    this.handle('db-create', async (event, table: string, data: Record<string, unknown>) => {
      const result = this.storageManager.create(table, data)
      event.sender.send('sync-data', table)
      return result
    })

    this.handle('db-read', async (_, table: string, id: number) => {
      return this.storageManager.read(table, id)
    })

    this.handle(
      'db-update',
      async (event, table: string, id: number, data: Record<string, unknown>) => {
        const result = this.storageManager.update(table, id, data)
        event.sender.send('sync-data', table)
        return result
      }
    )

    this.handle(
      'db-update-many',
      async (event, table: string, ids: number[], data: Record<string, unknown>[]) => {
        const result = this.storageManager.updateMany(table, ids, data)
        event.sender.send('sync-data', table)
        return result
      }
    )

    this.handle('db-delete', async (event, table: string, id: number) => {
      const result = this.storageManager.delete(table, id)
      event.sender.send('sync-data', table)
      return result
    })

    this.handle('db-list', async (_, table: string, conditions?: Record<string, unknown>) => {
      return this.storageManager.list(table, conditions)
    })
  }
}
