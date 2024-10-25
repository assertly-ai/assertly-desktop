import { createSyncedStore } from '@renderer/lib/createSyncedStore'

export interface Test {
  id: number
  name: string
  description?: string
  code?: string
  testSuiteId?: number
  userId?: number
}

interface TestState {
  data: Test[]
  setData: (data: Test[]) => void
  createTest: (testData: Omit<Test, 'id'>) => Promise<void>
  updateTest: (id: number, testData: Partial<Test>) => Promise<void>
  deleteTest: (id: number) => Promise<void>
  getTest: (id: number) => Promise<Test>
}

export const useTestStore = createSyncedStore<Test, TestState>('Tests', (set) => ({
  data: [],
  setData: (data) => set({ data: data.reverse() }),
  createTest: async (testData) => {
    await window.api.storage.create('Tests', testData)
  },
  updateTest: async (id, testData) => {
    await window.api.storage.update('Tests', id, testData)
  },
  deleteTest: async (id) => {
    await window.api.storage.delete('Tests', id)
  },
  getTest: async (id) => {
    return (await window.api.storage.read('Tests', id)) as Test
  }
}))
