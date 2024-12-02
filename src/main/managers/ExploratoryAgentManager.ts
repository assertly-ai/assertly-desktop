import { ChatCompletionMessageToolCall } from 'openai/resources'
import { OpenAIAdapter } from '../adapters/OpenAIAdapter'
import { BrowserManager } from './BrowserManager'
import { EventEmitter } from 'events'
import { WindowManager } from './WindowManager'
import { AgentMessage } from '../types/agent'

export enum ExploratoryAgentEvents {
  MESSAGE = 'ai-agent:message',
  QUESTION = 'ai-agent:question',
  ERROR = 'ai-agent:error',
  EXECUTING = 'ai-agent:executing',
  COMPLETED = 'ai-agent:completed'
}

export class ExploratoryAgentManager extends EventEmitter {
  private isProcessing: boolean = false
  private currentInstruction?: string
  private pendingUserResponse: boolean = false

  constructor(
    private openAIAdapter: OpenAIAdapter,
    private browserManager: BrowserManager,
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
    event = ExploratoryAgentEvents.MESSAGE
  ) {
    const message = this.createMessage(type, content)
    this.windowManager.mainWindow?.webContents.send(event, message)
  }

  async startInstruction(instruction: string): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Agent is already processing an instruction')
    }

    this.isProcessing = true
    this.currentInstruction = instruction

    try {
      await this.executeAgentLoop()
    } catch (error) {
      console.error('Error in agent execution:', error)
      this.sendMessage(
        'system',
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        ExploratoryAgentEvents.ERROR
      )
    } finally {
      this.isProcessing = false
    }
  }

  private async executeAgentLoop(): Promise<void> {
    while (this.isProcessing) {
      try {
        let screenshot: string | undefined

        try {
          screenshot = await this.browserManager.getActivePageScreenshot()
        } catch (error) {
          console.log('Error getting page context:', error)
        }

        const { actions } = await this.openAIAdapter.getNextAction(
          this.currentInstruction!,
          screenshot
        )

        if (!actions?.length) {
          continue
        }

        for (const action of actions) {
          await this.handleAction(action)
        }
      } catch (error) {
        console.error('Error in agent loop:', error)
        this.sendMessage(
          'system',
          `Error: ${error instanceof Error ? error.message : String(error)}`,
          ExploratoryAgentEvents.ERROR
        )
        this.openAIAdapter.addAction(`${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  private async handleAction(action: ChatCompletionMessageToolCall): Promise<void> {
    const { name, arguments: args } = action.function
    const parsedArgs = JSON.parse(args)

    try {
      switch (name) {
        case 'execute_playwright': {
          console.log('executing playwright code: \n', parsedArgs.code)
          await this.browserManager.executePlaywrightCode(parsedArgs.code, Date.now())
          this.sendMessage('assistant', parsedArgs.userFeedback)
          this.openAIAdapter.addAction(
            `Executed Playwright: ${parsedArgs.userFeedback}\nCode: ${parsedArgs.code}`
          )
          break
        }

        case 'ask_question_to_user': {
          console.log('ask_question_to_user: ', parsedArgs.message)
          this.pendingUserResponse = true
          this.sendMessage('assistant', parsedArgs.message, ExploratoryAgentEvents.QUESTION)
          const userResponse = await this.waitForUserResponse()
          this.openAIAdapter.addAction(
            `Asked user: ${parsedArgs.message}\nUser response: ${userResponse}`
          )
          break
        }

        case 'send_message_to_user': {
          console.log('send_message_to_user: ', parsedArgs.message)
          this.sendMessage('assistant', parsedArgs.message)
          this.openAIAdapter.addAction(`Sent message to user: ${parsedArgs.message}`)
          break
        }

        case 'task_completed': {
          console.log('task_completed: ', parsedArgs.message)
          this.sendMessage('assistant', parsedArgs.message)
          this.openAIAdapter.addAction(`Task completed: ${parsedArgs.message}`)
          this.isProcessing = false
          break
        }

        case 'find_element': {
          console.log('find_element: \n', parsedArgs)
          const elements = await this.browserManager.findElement(parsedArgs)
          this.openAIAdapter.addAction(
            `Found ${elements.length} elements with locator. Populated the current DOM context`
          )
          this.openAIAdapter.setDOMContext(JSON.stringify(elements, null, 2))
          break
        }

        case 'get_element_details': {
          console.log('get_element_details: \n', parsedArgs)
          const details = await this.browserManager.getElementDetails(parsedArgs.locator)
          this.openAIAdapter.addAction(
            `Element details for ${parsedArgs.locator}: ${JSON.stringify(details)}`
          )
          break
        }
      }
    } catch (error: unknown) {
      console.error(`Error executing action ${name}:`, error)
      this.openAIAdapter.addAction(
        `Error calling tool/function ${name}: ${error instanceof Error ? error.message : String(error)}`
      )
      throw error
    }
  }

  private waitForUserResponse(): Promise<string> {
    return new Promise((resolve) => {
      const handler = (response: string) => {
        this.pendingUserResponse = false
        this.removeListener('user:response', handler)
        resolve(response)
      }
      this.on('user:response', handler)
    })
  }

  provideUserResponse(response: string): void {
    if (this.pendingUserResponse) {
      this.emit('user:response', response)
    }
  }

  stopExecution(): void {
    this.isProcessing = false
  }

  clearAgentContext(): void {
    this.openAIAdapter.clearContext()
  }
}
