import { ElectronAPI } from '@electron-toolkit/preload'

// Define message types
interface AgentMessage {
  type: 'user' | 'assistant' | 'system'
  content: string
  metadata?: unknown
}

// Define event channels
type AgentEventChannel =
  | 'agent:message'
  | 'agent:question'
  | 'agent:error'
  | 'agent:executing'
  | 'agent:completed'

// Define event callbacks
type AgentEventCallback = {
  'agent:message': (message: AgentMessage) => void
  'agent:question': (question: string) => void
  'agent:error': (error: Error | string) => void
  'agent:executing': (feedback: string) => void
  'agent:completed': () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Agent methods
      startAgentInstruction: (instruction: string) => Promise<void>
      sendUserResponse: (response: string) => void
      stopAgent: () => void
      clearAgentContext: () => void

      // Event handlers
      on: <T extends AgentEventChannel>(channel: T, callback: AgentEventCallback[T]) => void
      off: <T extends AgentEventChannel>(channel: T, callback: AgentEventCallback[T]) => void

      // Legacy Playwright execution
      executePlaywrightCode: (code: string, blockId: number) => Promise<unknown>

      // Storage methods
      storage: {
        create: (table: string, data: Record<string, unknown>) => Promise<number>
        read: (table: string, id: number) => Promise<unknown>
        update: (table: string, id: number, data: Record<string, unknown>) => Promise<void>
        updateMany: (table: string, ids: number[], data: Record<string, unknown>[]) => Promise<void>
        delete: (table: string, id: number) => Promise<void>
        list: (table: string, conditions?: Record<string, unknown>) => Promise<unknown[]>
      }

      getCurrentPreviewUrl: () => Promise<string>
    }
  }
}
