import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  executePlaywrightCode: (code: string) => ipcRenderer.invoke('execute-playwright-code', code),
  storage: {
    create: (table: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db-create', table, data),
    read: (table: string, id: number) => ipcRenderer.invoke('db-read', table, id),
    update: (table: string, id: number, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db-update', table, id, data),
    delete: (table: string, id: number) => ipcRenderer.invoke('db-delete', table, id),
    list: (table: string, conditions?: Record<string, unknown>) =>
      ipcRenderer.invoke('db-list', table, conditions)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
