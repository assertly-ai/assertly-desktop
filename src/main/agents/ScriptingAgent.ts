import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { OPENAI_API_KEY, OPENAI_MODEL, OPENAI_ORG_ID } from '../config/constants'

interface ScriptStep {
  code: string
  selectorText?: string
}

interface ScriptResponse {
  script: ScriptStep[]
}

export class ScriptingAgent {
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

  async generateScript(userInstructions: string): Promise<ScriptResponse> {
    const formattedPrompt = SCRIPTING_AGENT_PROMPT.replace(
      '{{USER_INSTRUCTIONS}}',
      userInstructions
    )

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: formattedPrompt
      }
    ]

    console.log('Calling OpenAI for script generation')

    const response = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7, // Add some creativity while keeping responses focused
      response_format: { type: 'json_object' } // Ensure JSON response
    })

    if (response.usage) {
      this.totalTokensUsed.prompt_tokens += response.usage.prompt_tokens
      this.totalTokensUsed.completion_tokens += response.usage.completion_tokens
      this.totalTokensUsed.total_tokens += response.usage.total_tokens

      console.log('Token usage for script generation:', response.usage)
    }

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    try {
      const parsedResponse = JSON.parse(content) as ScriptResponse
      return parsedResponse
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      throw new Error('Failed to generate valid script')
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

  getTokenUsage(): typeof this.totalTokensUsed {
    return { ...this.totalTokensUsed }
  }
}

const SCRIPTING_AGENT_PROMPT = `You are a senior QA engineer specializing in end-to-end (E2E) testing using Playwright. Your task is to generate a Playwright script based on the following user instructions:

<user_instructions>
{{USER_INSTRUCTIONS}}
</user_instructions>

To create an appropriate script, follow these steps:

1. Analyze the user instructions carefully.
2. Plan a Playwright script that performs the requested actions.
3. Generate the script as an array of objects, where each object represents a step in the script.

Before generating the script, generate your planning process in the planning_process key in output json. Consider the following:
- What are the main actions required?
- Which selectors or page elements need to be interacted with? List them out.
- Are there any potential edge cases or error scenarios to handle?
- Where might timing issues occur, and where would waits be necessary?
- Outline a high-level flow of the test script.

When creating the script, follow these guidelines:
- Use appropriate Playwright methods to interact with web elements.
- Include necessary waits and assertions to ensure reliable test execution.
- Handle potential errors or exceptions gracefully.
- Use best practices for E2E testing, such as proper element selection.
- Assume that everything is imported and set up; you only need to use the 'page' variable.
- Do not wrap the script in any test, describe, or it blocks.

For each step in the script, create an object with the following properties:
- 'code': The actual Playwright code for this step.
- 'selectorText': (If applicable) A description of the selector used in this step, which can be used to find the right selector for interacting with elements.

Your output should be structured as follows:

{
  "planning_process": "planning process"
  "script": [
    {
      "code": "// Playwright code for step 1",
      "selectorText": "Description of selector used (if applicable)"
    },
    {
      "code": "// Playwright code for step 2",
      "selectorText": "Description of selector used (if applicable)"
    },
    // Additional steps...
  ]
}

Remember to adapt the script to the specific requirements provided in the user instructions. Ensure that your generated script is clear, concise, and follows Playwright best practices for E2E testing.

Now, please analyze the user instructions and generate the Playwright script accordingly.`
