import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptBlock from '@renderer/types/scriptBlock'
interface ScriptBlockState {
  data: ScriptBlock[]
  setData: (data: ScriptBlock[]) => void
  createScriptBlock: (scriptBlockData: Omit<ScriptBlock, 'id'>) => Promise<void>
  updateScriptBlock: (id: number, scriptBlockData: Partial<ScriptBlock>) => Promise<void>
  deleteScriptBlock: (id: number) => Promise<void>
  getScriptBlock: (id: number) => Promise<ScriptBlock>
  getScriptBlocksByScriptId: (scriptId: number) => ScriptBlock[]
}

export const useScriptBlockStore = createSyncedStore<ScriptBlock, ScriptBlockState>(
  'ScriptBlocks',
  (set) => ({
    data: [],
    setData: (data) => set({ data }),
    createScriptBlock: async (scriptBlockData) => {
      await window.api.storage.create('ScriptBlocks', scriptBlockData)
    },
    updateScriptBlock: async (id, scriptBlockData) => {
      await window.api.storage.update('ScriptBlocks', id, scriptBlockData)
    },
    deleteScriptBlock: async (id) => {
      await window.api.storage.delete('ScriptBlocks', id)
    },
    getScriptBlock: async (id) => {
      return (await window.api.storage.read('ScriptBlocks', id)) as ScriptBlock
    },
    getScriptBlocksByScriptId: (scriptId) => {
      return useScriptBlockStore
        .getState()
        .data.filter((block: ScriptBlock) => block?.scriptId === scriptId)
    }
  })
)
