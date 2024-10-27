import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import Script from '@renderer/types/script'
interface ScriptState {
  data: Script[]
  setData: (data: Script[]) => void
  createScript: (scriptData: Omit<Script, 'id'>) => Promise<void>
  updateScript: (id: number, scriptData: Partial<Script>) => Promise<void>
  deleteScript: (id: number) => Promise<void>
  getScript: (id: number) => Promise<Script>
}

export const useScriptStore = createSyncedStore<Script, ScriptState>('Scripts', (set) => ({
  data: [],
  setData: (data) => set({ data: data.reverse() }),
  createScript: async (scriptData) => {
    await window.api.storage.create('Scripts', scriptData)
  },
  updateScript: async (id, scriptData) => {
    await window.api.storage.update('Scripts', id, scriptData)
  },
  deleteScript: async (id) => {
    await window.api.storage.delete('Scripts', id)
  },
  getScript: async (id) => {
    return (await window.api.storage.read('Scripts', id)) as Script
  }
}))
