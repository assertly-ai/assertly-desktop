import { createSyncedStore } from '@renderer/lib/createSyncedStore'
import ScriptModuleBlock from '@renderer/types/scriptModuleBlock'
interface ScriptModuleBlockState {
  data: ScriptModuleBlock[]
  setData: (data: ScriptModuleBlock[]) => void
  createScriptModuleBlock: (ScriptModuleBlockData: Omit<ScriptModuleBlock, 'id'>) => Promise<void>
  updateScriptModuleBlock: (
    id: number,
    ScriptModuleBlockData: Partial<ScriptModuleBlock>
  ) => Promise<void>
  deleteScriptModuleBlock: (id: number) => Promise<void>
  getScriptModuleBlock: (id: number) => Promise<ScriptModuleBlock>
  getScriptModuleBlocksByModuleId: (scriptId: number) => ScriptModuleBlock[]
}

export const useScriptModuleBlockStore = createSyncedStore<
  ScriptModuleBlock,
  ScriptModuleBlockState
>('ScriptModuleBlocks', (set) => ({
  data: [],
  setData: (data) => set({ data }),
  createScriptModuleBlock: async (ScriptModuleBlockData) => {
    await window.api.storage.create('ScriptModuleBlocks', ScriptModuleBlockData)
  },
  updateScriptModuleBlock: async (id, ScriptModuleBlockData) => {
    await window.api.storage.update('ScriptModuleBlocks', id, ScriptModuleBlockData)
  },
  deleteScriptModuleBlock: async (id) => {
    await window.api.storage.delete('ScriptModuleBlocks', id)
    const updatedBlocks = useScriptModuleBlockStore
      .getState()
      .data.filter((block: ScriptModuleBlock) => block?.id !== id)
      .map((block: ScriptModuleBlock, index: number) => ({
        ...block,
        blockOrder: index
      }))
    const ids = updatedBlocks.map((_) => _.id)
    await window.api.storage.updateMany('ScriptModuleBlocks', ids, updatedBlocks)
  },
  getScriptModuleBlock: async (id) => {
    return (await window.api.storage.read('ScriptModuleBlocks', id)) as ScriptModuleBlock
  },
  getScriptModuleBlocksByModuleId: (scriptModuleId) => {
    return useScriptModuleBlockStore
      .getState()
      .data.filter((block: ScriptModuleBlock) => block?.scriptModuleId === scriptModuleId)
      .sort((a, b) => a.blockOrder - b.blockOrder)
  }
}))
