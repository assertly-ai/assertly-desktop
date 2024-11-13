import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptModule from '@renderer/types/scriptModule'
interface ScriptModuleState {
  data: ScriptModule[]
  setData: (data: ScriptModule[]) => void
  createScriptModule: (scriptData: Omit<ScriptModule, 'id'>) => Promise<void>
  updateScriptModule: (id: number, scriptModuleData: Partial<ScriptModule>) => Promise<void>
  deleteScriptModule: (id: number) => Promise<void>
  getScriptModule: (id: number) => Promise<ScriptModule>
}

export const useScriptModuleStore = createSyncedStore<ScriptModule, ScriptModuleState>(
  'ScriptModules',
  (set) => ({
    data: [],
    setData: (data) => set({ data: data.reverse() }),
    createScriptModule: async (scriptData) => {
      await window.api.storage.create('ScriptModules', scriptData)
    },
    updateScriptModule: async (id, scriptData) => {
      await window.api.storage.update('ScriptModules', id, scriptData)
    },
    deleteScriptModule: async (id) => {
      await window.api.storage.delete('ScriptModules', id)
    },
    getScriptModule: async (id) => {
      return (await window.api.storage.read('ScriptModules', id)) as ScriptModule
    }
  })
)
