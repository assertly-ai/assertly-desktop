import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'

export abstract class BaseHandler {
  abstract setup(): void

  protected handle<T extends unknown[]>(
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: T) => Promise<unknown> | unknown
  ): void {
    ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: unknown[]) => {
      return listener(event, ...(args as T))
    })
  }

  protected on<T extends unknown[]>(
    channel: string,
    listener: (event: IpcMainEvent, ...args: T) => void
  ): void {
    ipcMain.on(channel, (event: IpcMainEvent, ...args: unknown[]) => {
      listener(event, ...(args as T))
    })
  }
}
