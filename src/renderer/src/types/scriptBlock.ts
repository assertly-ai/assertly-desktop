export default interface ScriptBlock {
  id: number
  code: string
  blockOrder: number
  instruction: string
  scriptId: number
  userId?: number
}
