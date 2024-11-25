import { BaseHandler } from './BaseHandler'
import { AgentManager } from '../managers/AgentManager'

export class AgentHandler extends BaseHandler {
  constructor(private agentManager: AgentManager) {
    super()
  }

  setup(): void {
    this.handle('ai-agent:execute-agent', async (_, instruction: string) => {
      await this.agentManager.startInstruction(instruction)
    })

    this.on('ai-agent:user-response', (_, response: string) => {
      this.agentManager.provideUserResponse(response)
    })

    this.on('ai-agent:stop-agent', () => {
      this.agentManager.stopExecution()
    })

    this.on('ai-agent:clear-context', () => {
      this.agentManager.clearAgentContext()
    })
  }
}
