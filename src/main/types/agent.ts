export interface AgentMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: unknown
}
