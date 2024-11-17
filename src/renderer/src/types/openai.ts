export type AgentResponse = {
  success: boolean
  screenshot?: string
  error?: unknown
}

export type Message = {
  id: string
  content: string
  sender: 'user' | 'assistant' | 'system'
  timestamp: Date
  screenshot?: string // Add screenshot to message type
}
