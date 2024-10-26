import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptResult from '@renderer/types/scriptResult'

interface ScriptResultState {
  data: ScriptResult[]
  setData: (data: ScriptResult[]) => void
  createScriptResult: (ScriptResultData: Omit<ScriptResult, 'id' | 'createdAt'>) => Promise<void>
  updateScriptResult: (id: number, ScriptResultData: Partial<ScriptResult>) => Promise<void>
  deleteScriptResult: (id: number) => Promise<void>
  getScriptResultsByScriptId: (ScriptId: number) => ScriptResult[]
}

export const useScriptResultStore = createSyncedStore<ScriptResult, ScriptResultState>(
  'ScriptResults',
  (set, get) => ({
    data: [],
    setData: (data) => set({ data }),
    createScriptResult: async (ScriptResultData) => {
      await window.api.storage.create('ScriptResults', {
        ...ScriptResultData,
        createdAt: new Date().toISOString()
      })
    },
    updateScriptResult: async (id, ScriptResultData) => {
      await window.api.storage.update('ScriptResults', id, ScriptResultData)
    },
    deleteScriptResult: async (id) => {
      await window.api.storage.delete('ScriptResults', id)
    },
    getScriptResultsByScriptId: (scriptId) => {
      return get().data.filter((result) => result.scriptId === scriptId)
    }
  })
)