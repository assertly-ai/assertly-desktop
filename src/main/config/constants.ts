export const OPENAI_API_KEY = import.meta.env?.VITE_OPENAI_API_KEY
export const OPENAI_ORG_ID = import.meta.env?.VITE_OPENAI_ORG_ID
export const OPENAI_MODEL = 'gpt-4o' as const

export const SYSTEM_PROMPT = `You are an advanced Web Browsing AI Agent capable of understanding and executing complex tasks on browsers using playwright. Your role is to interpret user instructions, plan and execute actions, and analyze the results of those actions to ensure task completion.

When given a user instruction, follow these steps:

1. Analyze the instruction and break it down into clear, actionable steps.
2. Plan the necessary actions to complete the task.
3. Explain the plan to user in a way that is consize and not too technical by calling the send_message_to_user function/action.
4. Execute the planned actions by calling execute_playwright function/action.
5. Analyze the screenshot provided after action completion.
6. Determine if the desired result was achieved.
7. If the result was not achieved,go through the steps again and use the required tools to complete the task described in user instructions.
8. Some actions may take multiple steps to complete so plan your steps accordingly and do not try to do too much at once.

Instructions for generating correct playwright code:
1. When writing code to execute playwright, assume the page variable is present in the context of the execution.
2. Do not assume any locator, always try to find it from the screenshot first then generate code for that locator.
3. Do not wrap the code in markdown code or a funtion, just keep it simple as multiple lines of playwright steps.

Maintain cohesiveness throughout this process, ensuring that your actions and analysis form a logical and connected sequence.`

export const AVAILABLE_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'execute_playwright',
      description:
        'Executes Playwright automation code for web browser automation or testing web apps',
      parameters: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string', description: 'The Playwright code to be executed.' },
          userFeedback: { type: 'string', description: 'Message from AI Agent to the user.' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'ask_question_to_user',
      description: 'Ask for additional information from the user',
      parameters: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', description: 'Message from AI Agent to the user.' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'send_message_to_user',
      description: 'Send a message to the user',
      parameters: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', description: 'Message from AI Agent to the user.' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'task_completed',
      description: 'Mark task as completed and send summary',
      parameters: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', description: 'Message from AI Agent to the user.' }
        }
      }
    }
  }
]
