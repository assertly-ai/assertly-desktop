import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptSuite from '@renderer/types/ScriptSuite'

interface ScriptSuiScriptate {
  data: ScriptSuite[]
  setData: (data: ScriptSuite[]) => void
  createScriptSuite: (scriptSuiteData: Omit<ScriptSuite, 'id'>) => Promise<void>
  updateScriptSuite: (id: number, ScriptSuiteData: Partial<ScriptSuite>) => Promise<void>
  deleteScriptSuite: (id: number) => Promise<void>
}

export const useScriptSuiScriptore = createSyncedStore<ScriptSuite, ScriptSuiScriptate>(
  'ScriptSuites',
  (set) => ({
    data: [],
    setData: (data) => set({ data }),
    createScriptSuite: async (scriptSuiteData) => {
      await window.api.storage.create('ScriptSuites', scriptSuiteData)
    },
    updateScriptSuite: async (id, scriptSuiteData) => {
      await window.api.storage.update('ScriptSuites', id, scriptSuiteData)
    },
    deleteScriptSuite: async (id) => {
      await window.api.storage.delete('ScriptSuites', id)
    }
  })
)
