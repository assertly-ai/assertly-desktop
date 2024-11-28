import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  startAgentInstruction: (instruction: string) =>
    ipcRenderer.invoke('ai-agent:execute-agent', instruction),

  sendUserResponse: (response: string) => ipcRenderer.send('ai-agent:user-response', response),

  stopAgent: () => ipcRenderer.send('ai-agent:stop-agent'),

  clearAgentContext: () => ipcRenderer.send('ai-agent:clear-context'),

  on: (channel: string, callback: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (_, ...args) => callback(...args)),

  off: (channel: string, callback: (...args: unknown[]) => void) =>
    ipcRenderer.removeListener(channel, callback),

  executePlaywrightCode: (code: string, blockId: number) =>
    ipcRenderer.invoke('execute-playwright-code', code, blockId),

  // Add new agent-related methods
  executeAgentInstruction: (instruction: string) =>
    ipcRenderer.invoke('execute-agent-instruction', instruction),

  storage: {
    create: (table: string, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db-create', table, data),
    read: (table: string, id: number) => ipcRenderer.invoke('db-read', table, id),
    update: (table: string, id: number, data: Record<string, unknown>) =>
      ipcRenderer.invoke('db-update', table, id, data),
    updateMany: (table: string, ids: number[], data: Record<string, unknown>[]) =>
      ipcRenderer.invoke('db-update-many', table, ids, data),
    delete: (table: string, id: number) => ipcRenderer.invoke('db-delete', table, id),
    list: (table: string, conditions?: Record<string, unknown>) =>
      ipcRenderer.invoke('db-list', table, conditions)
  },

  getCurrentPreviewUrl: () => ipcRenderer.invoke('get-preview-url')
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
