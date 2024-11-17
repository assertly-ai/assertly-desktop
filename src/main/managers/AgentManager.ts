import { ChatCompletionMessageToolCall } from 'openai/resources'
import { OpenAIAdapter } from '../adapters/OpenAIAdapter'
import { BrowserManager } from './BrowserManager'
import { EventEmitter } from 'events'
import { WindowManager } from './WindowManager'

export enum AgentEvents {
  MESSAGE = 'ai-agent:message',
  QUESTION = 'ai-agent:question',
  ERROR = 'ai-agent:error',
  EXECUTING = 'ai-agent:executing',
  COMPLETED = 'ai-agent:completed'
}

export interface AgentMessage {
  type: 'user' | 'assistant' | 'system'
  content: string
  metadata?: unknown
}

export class AgentManager extends EventEmitter {
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

  async startInstruction(instruction: string): Promise<void> {
    if (this.isProcessing) {
      throw new Error('Agent is already processing an instruction')
    }
    console.log('reached agent manager')

    this.isProcessing = true
    this.currentInstruction = instruction

    try {
      this.openAIAdapter.addToContext({
        role: 'user',
        content: `User Instrution: ${this.currentInstruction}`
      })

      await this.executeAgentLoop()
    } catch (error) {
      this.windowManager.mainWindow?.webContents.send(AgentEvents.ERROR, error)
    } finally {
      this.isProcessing = false
    }
  }

  private async executeAgentLoop(): Promise<void> {
    while (this.isProcessing) {
      try {
        // Get both screenshot and accessibility tree
        const screenshot = await this.browserManager.getCurrentPageScreenshot()
        const accessibilityTree = await this.browserManager.getAccessibilityTree()

        if (!screenshot) {
          throw new Error('Could not capture screenshot')
        }
        const base64Image = screenshot.replace(/^data:image\/\w+;base64,/, '')

        const { actions } = await this.openAIAdapter.getNextAction([
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Current page state:
                1. Screenshot provided below
                2. Accessibility tree:
                ${JSON.stringify(accessibilityTree, null, 2)}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ])

        if (!actions?.length) {
          this.windowManager.mainWindow?.webContents.send(AgentEvents.COMPLETED)
          break
        }

        for (const action of actions) {
          await this.handleAction(action)
        }
      } catch (error) {
        this.windowManager.mainWindow?.webContents.send(AgentEvents.ERROR, error)
        break
      }
    }
  }

  private async handleAction(action: ChatCompletionMessageToolCall): Promise<void> {
    const { name, arguments: args } = action.function // Add id to destructuring
    const parsedArgs = JSON.parse(args)
    let userResponse = ''

    switch (name) {
      case 'execute_playwright':
        try {
          await this.browserManager.executePlaywrightCode(parsedArgs.code, Date.now())
          this.windowManager.mainWindow?.webContents.send(AgentEvents.MESSAGE, {
            type: 'assistant',
            content: parsedArgs.userFeedback
          })
          // Add tool response
          this.openAIAdapter.addToContext({
            role: 'tool',
            tool_call_id: action.id,
            content: 'Playwright execution completed successfully'
          })
        } catch (err) {
          this.openAIAdapter.addToContext({
            role: 'tool',
            tool_call_id: action.id,
            content: `Error occurred while executing playwright: ${err}`
          })
        }
        break

      case 'ask_question_to_user':
        this.pendingUserResponse = true
        this.windowManager.mainWindow?.webContents.send(AgentEvents.QUESTION, parsedArgs.message)
        userResponse = await this.waitForUserResponse()
        this.openAIAdapter.addToContext({
          role: 'tool',
          tool_call_id: action.id,
          content: userResponse
        })
        break

      case 'send_message_to_user':
        this.windowManager.mainWindow?.webContents.send(AgentEvents.MESSAGE, {
          type: 'assistant',
          content: parsedArgs.message
        })
        this.openAIAdapter.addToContext({
          role: 'tool',
          tool_call_id: action.id,
          content: 'Message sent to user successfully'
        })
        break

      case 'task_completed':
        this.windowManager.mainWindow?.webContents.send(AgentEvents.MESSAGE, {
          type: 'assistant',
          content: parsedArgs.message
        })
        this.windowManager.mainWindow?.webContents.send(AgentEvents.COMPLETED)
        this.openAIAdapter.addToContext({
          role: 'tool',
          tool_call_id: action.id,
          content: 'Task completed successfully'
        })
        this.isProcessing = false
        break
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
      this.windowManager.mainWindow?.webContents.send('user:response', response)
    }
  }

  stopExecution(): void {
    this.isProcessing = false
  }

  clearAgentContext(): void {
    this.openAIAdapter.clearContext()
  }
}
