import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '../config/constants'

interface LocatorSuggestion {
  selector: string
  confidence: number
  rationale: string
}

interface LocatorResponse {
  suggestions: LocatorSuggestion[]
  fallbackStrategies?: string[]
}

export class ElementLocatorAgent {
  private client: OpenAI
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

  async findLocators(
    screenshot: string, // base64 encoded screenshot
    selectorDescription: string,
    stepContext: string
  ): Promise<LocatorResponse> {
    const formattedPrompt = LOCATOR_FINDING_PROMPT.replace(
      '{{SELECTOR_DESCRIPTION}}',
      selectorDescription
    ).replace('{{STEP_CONTEXT}}', stepContext)

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: formattedPrompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${screenshot}`,
              detail: 'high'
            }
          }
        ]
      }
    ]

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.3, // Keep it focused on precise locator finding
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    })

    if (response.usage) {
      this.totalTokensUsed.prompt_tokens += response.usage.prompt_tokens
      this.totalTokensUsed.completion_tokens += response.usage.completion_tokens
      this.totalTokensUsed.total_tokens += response.usage.total_tokens
    }

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    try {
      return JSON.parse(content) as LocatorResponse
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      throw new Error('Failed to generate valid locators')
    }
  }

  async validateLocator(page: any, selector: string, expectedContext: string): Promise<boolean> {
    try {
      const element = await page.locator(selector)
      const isVisible = await element.isVisible()
      const count = await element.count()

      // Validate uniqueness and visibility
      if (!isVisible || count !== 1) {
        return false
      }

      // Additional validation based on context
      if (expectedContext.toLowerCase().includes('button')) {
        const isClickable = await element.isEnabled()
        return isClickable
      }

      if (expectedContext.toLowerCase().includes('input')) {
        const isEditable = await element.isEditable()
        return isEditable
      }

      return true
    } catch (error) {
      console.error('Locator validation failed:', error)
      return false
    }
  }

  clearContext(): void {
    console.log('Final token usage summary:', this.totalTokensUsed)
    this.totalTokensUsed = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    }
  }
}

const LOCATOR_FINDING_PROMPT = `You are an expert at finding reliable Playwright locators based on visual information. I will provide you with:

1. A screenshot of a webpage
2. A description of the element we need to interact with
3. The context of the test step being performed

Your task is to analyze the visual information and suggest the most reliable Playwright locators for the element.

Element to find:
{{SELECTOR_DESCRIPTION}}

Step context:
{{STEP_CONTEXT}}

Guidelines for locator selection:
1. Prioritize methods in this order:
   - getByRole() with name
   - getByText() for visible text
   - getByLabel() for form inputs
   - getByPlaceholder() for inputs with placeholders
   - getByTestId() if visible
   - Other reliable selectors as fallback

2. Avoid brittle selectors like:
   - Complex CSS selectors
   - XPath
   - Index-based selection unless absolutely necessary
   - Class names that look auto-generated

3. For each suggestion, provide:
   - The complete selector
   - Confidence score (0-1)
   - Rationale for why this selector should work

4. If the element might be dynamic or hard to locate, provide fallback strategies.

Your response should be a JSON object with this structure:
{
  "suggestions": [
    {
      "selector": "page.getByRole('button', { name: 'Submit' })",
      "confidence": 0.95,
      "rationale": "Clear button with consistent text 'Submit'"
    }
  ],
  "fallbackStrategies": [
    "Try waiting for element to be visible",
    "Check if element is in a frame",
    "Verify if element requires scrolling into view"
  ]
}

Analyze the screenshot carefully and provide the most reliable locators possible.`
