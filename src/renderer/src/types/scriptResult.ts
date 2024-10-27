export default interface ScriptResult {
  id: number
  scriptId: number
  status: 'passed' | 'failed' | 'error'
  duration?: number
  errorMessage?: string
  screenshotPath?: string
  createdAt: string
}
