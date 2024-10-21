import { createSyncedStore } from '@renderer/lib/createSyncedStore'

interface TestResult {
  id: number
  testId: number
  status: 'passed' | 'failed' | 'error'
  duration?: number
  errorMessage?: string
  screenshotPath?: string
  createdAt: string
}

interface TestResultState {
  data: TestResult[]
  setData: (data: TestResult[]) => void
  createTestResult: (testResultData: Omit<TestResult, 'id' | 'createdAt'>) => Promise<void>
  updateTestResult: (id: number, testResultData: Partial<TestResult>) => Promise<void>
  deleteTestResult: (id: number) => Promise<void>
  getTestResultsByTestId: (testId: number) => TestResult[]
}

export const useTestResultStore = createSyncedStore<TestResult, TestResultState>(
  'TestResults',
  (set, get) => ({
    data: [],
    setData: (data) => set({ data }),
    createTestResult: async (testResultData) => {
      await window.api.storage.create('TestResults', {
        ...testResultData,
        createdAt: new Date().toISOString()
      })
    },
    updateTestResult: async (id, testResultData) => {
      await window.api.storage.update('TestResults', id, testResultData)
    },
    deleteTestResult: async (id) => {
      await window.api.storage.delete('TestResults', id)
    },
    getTestResultsByTestId: (testId) => {
      return get().data.filter((result) => result.testId === testId)
    }
  })
)
