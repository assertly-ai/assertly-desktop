import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptBlockResult from '@renderer/types/scriptBlockResult'

interface ScriptBlockResultState {
  data: ScriptBlockResult[]
  setData: (data: ScriptBlockResult[]) => void
  createScriptBlockResult: (
    scriptResultData: Omit<ScriptBlockResult, 'id' | 'createdAt'>
  ) => Promise<void>
  updateScriptBlockResult: (
    id: number,
    scriptBlockResultData: Partial<ScriptBlockResult>
  ) => Promise<void>
  deleteScriptBlockResult: (id: number) => Promise<void>
  getScriptBlockResultsByScriptId: (scriptId: number) => ScriptBlockResult[]
  getScriptBlockResultsByScriptBlockId: (scriptBlockId: number) => ScriptBlockResult[]
}

export const useScriptBlockResultStore = createSyncedStore<
  ScriptBlockResult,
  ScriptBlockResultState
>('ScriptBlockResults', (set, get) => ({
  data: [],
  setData: (data) => set({ data }),
  createScriptBlockResult: async (scriptResultData) => {
    await window.api.storage.create('ScriptBlockResults', {
      ...scriptResultData,
      createdAt: new Date().toISOString()
    })
  },
  updateScriptBlockResult: async (id, scriptResultData) => {
    await window.api.storage.update('ScriptBlockResults', id, scriptResultData)
  },
  deleteScriptBlockResult: async (id) => {
    await window.api.storage.delete('ScriptBlockResults', id)
  },
  getScriptBlockResultsByScriptId: (scriptId) => {
    return get().data.filter((result) => result.scriptId === scriptId)
  },
  getScriptBlockResultsByScriptBlockId: (scriptBlockId) => {
    return get().data.filter((result) => result.scriptBlockId === scriptBlockId)
  }
}))
