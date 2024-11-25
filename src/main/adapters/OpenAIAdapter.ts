import OpenAI from 'openai'
import {
  ChatCompletionContentPart,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
  ChatCompletionTool
} from 'openai/resources/chat/completions'
import { AVAILABLE_TOOLS, OPENAI_API_KEY, OPENAI_MODEL, OPENAI_ORG_ID } from '../config/constants'
import { getBrowsingAgentPrompt } from '../config/prompts/browsing_agent_prompt'

export class OpenAIAdapter {
  private client: OpenAI
  private actions: string[] = []
  private domContext: string = 'No DOM context available yet'
  private totalTokensUsed: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  } = {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  }

  constructor() {
    this.client = new OpenAI({
      apiKey: OPENAI_API_KEY,
      organization: OPENAI_ORG_ID
    })
  }

  async getNextAction(
    userMessage: string,
    screenshot?: string
  ): Promise<{
    actions: ChatCompletionMessageToolCall[]
    response: ChatCompletionMessage
  }> {
    const userPrompt = getBrowsingAgentPrompt(
      userMessage,
      this.actions.length ? this.actions.join('\n') : 'No actions taken yet',
      this.domContext
    )

    const messageContent: ChatCompletionContentPart[] = [
      {
        type: 'text',
        text: userPrompt
      }
    ]

    if (screenshot) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: screenshot,
          detail: 'high'
        }
      })
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: messageContent
      }
    ]

    console.log('Calling OpenAI')

    const response = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      tools: AVAILABLE_TOOLS as ChatCompletionTool[],
      tool_choice: 'auto'
    })

    if (response.usage) {
      this.totalTokensUsed.prompt_tokens += response.usage.prompt_tokens
      this.totalTokensUsed.completion_tokens += response.usage.completion_tokens
      this.totalTokensUsed.total_tokens += response.usage.total_tokens

      console.log('Accumulated token usage:', this.totalTokensUsed)
    }

    const content = response.choices[0].message.content
    console.log('Open AI content: ', content)

    const actions = response.choices[0].message.tool_calls || []

    return { actions, response: response.choices[0].message }
  }

  addAction(action: string): void {
    this.actions.push(action)
  }

  setDOMContext(context: string): void {
    this.domContext = context
  }

  clearContext(): void {
    console.log('Final token usage summary:', this.totalTokensUsed)

    this.actions = []
    this.domContext = 'No DOM context available yet'
    this.totalTokensUsed = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }

  getTokenUsage(): typeof this.totalTokensUsed {
    return { ...this.totalTokensUsed }
  }
}
