import { EventEmitter } from 'events'
import { OpenAIAdapter } from '../adapters/OpenAIAdapter'
import { WindowManager } from './WindowManager'
import { AgentMessage } from '../types/agent'

export enum ScriptingAgentEvents {
  MESSAGE = 'script-agent:message',
  CODE = 'script-agent:code',
  ERROR = 'script-agent:error',
  COMPLETED = 'script-agent:completed'
}

export class ScriptingAgentManager extends EventEmitter {
  private isProcessing: boolean = false

  constructor(
    private openAIAdapter: OpenAIAdapter,
    private windowManager: WindowManager
  ) {
    super()
  }

  private createMessage(type: AgentMessage['type'], content: string): AgentMessage {
    return {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date().toISOString()
    }
  }

  private sendMessage(
    type: AgentMessage['type'],
    content: string,
    event = ScriptingAgentEvents.MESSAGE
  ) {
    const message = this.createMessage(type, content)
    this.windowManager.mainWindow?.webContents.send(event, message)
  }

  async generateScript(instruction: string): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Agent is already processing an instruction')
    }

    this.isProcessing = true

    try {
      const { actions } = await this.openAIAdapter.getScriptGeneration(instruction)

      if (!actions?.length) {
        throw new Error('No script was generated')
      }

      const action = actions[0] // We expect only one action for script generation

      if (action.function.name === 'generate_playwright_script') {
        const args = JSON.parse(action.function.arguments)

        // Send the generated code to the frontend
        this.sendMessage('code', args.code, ScriptingAgentEvents.CODE)

        // Mark as completed
        this.sendMessage('system', 'Script generation completed', ScriptingAgentEvents.COMPLETED)
      } else {
        throw new Error('Unexpected action received from AI')
      }
    } catch (error) {
      console.error('Error in script generation:', error)
      this.sendMessage(
        'system',
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        ScriptingAgentEvents.ERROR
      )
    } finally {
      this.isProcessing = false
    }
  }

  stopGeneration(): void {
    this.isProcessing = false
  }

  clearAgentContext(): void {
    this.openAIAdapter.clearContext()
  }
}
