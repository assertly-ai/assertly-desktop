import { createSyncedStore } from '@renderer/lib/createSyncedStore'

interface TestSuite {
  id: number
  name: string
  description?: string
  userId: number
}

interface TestSuiteState {
  data: TestSuite[]
  setData: (data: TestSuite[]) => void
  createTestSuite: (testSuiteData: Omit<TestSuite, 'id'>) => Promise<void>
  updateTestSuite: (id: number, testSuiteData: Partial<TestSuite>) => Promise<void>
  deleteTestSuite: (id: number) => Promise<void>
}

export const useTestSuiteStore = createSyncedStore<TestSuite, TestSuiteState>(
  'TestSuites',
  (set) => ({
    data: [],
    setData: (data) => set({ data }),
    createTestSuite: async (testSuiteData) => {
      await window.api.storage.create('TestSuites', testSuiteData)
    },
    updateTestSuite: async (id, testSuiteData) => {
      await window.api.storage.update('TestSuites', id, testSuiteData)
    },
    deleteTestSuite: async (id) => {
      await window.api.storage.delete('TestSuites', id)
    }
  })
)
