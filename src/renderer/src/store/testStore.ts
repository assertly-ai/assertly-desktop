import { createSyncedStore } from '@renderer/lib/createSyncedStore'

export interface Test {
  id: number
  name: string
  description?: string
  playwrightCode?: string
  testSuiteId?: number
  userId?: number
}

interface TestState {
  data: Test[]
  setData: (data: Test[]) => void
  createTest: (testData: Omit<Test, 'id'>) => Promise<void>
  updateTest: (id: number, testData: Partial<Test>) => Promise<void>
  deleteTest: (id: number) => Promise<void>
}

export const useTestStore = createSyncedStore<Test, TestState>('Tests', (set) => ({
  data: [],
  setData: (data) => set({ data }),
  createTest: async (testData) => {
    await window.api.storage.create('Tests', testData)
  },
  updateTest: async (id, testData) => {
    await window.api.storage.update('Tests', id, testData)
  },
  deleteTest: async (id) => {
    await window.api.storage.delete('Tests', id)
  }
}))
