import { ScriptingAgentManager } from '../managers/ScriptingAgentManager'
import { BaseHandler } from './BaseHandler'

export class ScriptingAgentHandler extends BaseHandler {
  constructor(private scriptingAgentManager: ScriptingAgentManager) {
    super()
  }

  setup(): void {
    this.handle('scripting-ai-agent:execute-agent', async (_, instruction: string) => {
      await this.scriptingAgentManager.generateScript(instruction)
    })
  }
}
