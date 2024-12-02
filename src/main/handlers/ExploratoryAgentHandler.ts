import { ExploratoryAgentManager } from '../managers/ExploratoryAgentManager'
import { BaseHandler } from './BaseHandler'

export class ExploratoryAgentHandler extends BaseHandler {
  constructor(private exploratoryAgentManager: ExploratoryAgentManager) {
    super()
  }

  setup(): void {
    this.handle('ai-agent:execute-agent', async (_, instruction: string) => {
      await this.exploratoryAgentManager.startInstruction(instruction)
    })

    this.on('ai-agent:user-response', (_, response: string) => {
      this.exploratoryAgentManager.provideUserResponse(response)
    })

    this.on('ai-agent:stop-agent', () => {
      this.exploratoryAgentManager.stopExecution()
    })

    this.on('ai-agent:clear-context', () => {
      this.exploratoryAgentManager.clearAgentContext()
    })
  }
}
