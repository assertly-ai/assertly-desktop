export default interface ScriptBlockResult {
  id: number
  scriptId: number
  scriptBlockId: number
  status: 'passed' | 'failed' | 'error'
  message?: string
  duration?: number
  errorMessage?: string
  screenshotPath?: string
  createdAt: string
}
