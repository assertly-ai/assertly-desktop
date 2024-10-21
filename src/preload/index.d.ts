import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      executePlaywrightCode: (code: string) => Promise<unknown>
      storage: {
        create: (table: string, data: Record<string, unknown>) => Promise<number>
        read: (table: string, id: number) => Promise<unknown>
        update: (table: string, id: number, data: Record<string, unknown>) => Promise<void>
        delete: (table: string, id: number) => Promise<void>
        list: (table: string, conditions?: Record<string, unknown>) => Promise<unknown[]>
      }
    }
  }
}
