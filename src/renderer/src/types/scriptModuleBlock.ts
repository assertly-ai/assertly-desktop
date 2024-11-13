export default interface ScriptModuleBlock {
  id: number
  code: string
  blockOrder: number
  instruction: string
  scriptModuleId: number
  userId?: number
}
