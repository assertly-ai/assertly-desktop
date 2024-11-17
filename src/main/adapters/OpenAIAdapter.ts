import OpenAI from 'openai'
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool
} from 'openai/resources/chat/completions'
import {
  AVAILABLE_TOOLS,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  OPENAI_ORG_ID,
  SYSTEM_PROMPT
} from '../config/constants'

export class OpenAIAdapter {
  private client: OpenAI
  private context: ChatCompletionMessageParam[] = []

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      organization: OPENAI_ORG_ID
    })
    this.initializeSystemPrompt()
  }

  private initializeSystemPrompt(): void {
    this.context.push({
      role: 'system',
      content: SYSTEM_PROMPT
    })
  }

  async getNextAction(messages: ChatCompletionMessageParam[]): Promise<{
    actions: ChatCompletionMessageToolCall[]
    response: ChatCompletionMessage
  }> {
    this.context.push(...messages)

    console.log('reached openai')

    const response = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: this.context,
      tools: AVAILABLE_TOOLS as ChatCompletionTool[],
      tool_choice: 'auto'
    })

    const actions = response.choices[0].message.tool_calls || []

    this.context.push({
      role: 'assistant',
      content: '',
      tool_calls: actions
    })

    return { actions, response: response.choices[0].message }
  }

  clearContext(): void {
    this.context = this.context.slice(0, 1)
  }

  addToContext(message: ChatCompletionMessageParam): void {
    this.context.push(message)
  }
}
