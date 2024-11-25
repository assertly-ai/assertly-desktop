export const OPENAI_API_KEY = import.meta.env?.VITE_OPENAI_API_KEY
export const OPENAI_ORG_ID = import.meta.env?.VITE_OPENAI_ORG_ID
export const OPENAI_MODEL = 'gpt-4o' as const

export const SYSTEM_PROMPT = `You are an advanced Web Browsing AI Agent capable of understanding and executing complex automation tasks, breaking it down in to actionable steps and executing them on browsers using playwright. Your role is to interpret user instructions, plan and execute actions, and analyze the results of those actions to ensure task completion.

## Plan of Action:
1. Analyze the user message and break it down into steps of actions you can take to get to the outcome.
2. Plan the necessary actions as a sequence of playwright automations or tool calls.
3. Explain the plan to user in a way that is consize and not too technical by calling the send_message_to_user function/action.
4. Generate and Execute each action by calling tool/execute_playwright function/action.
5. System will execute the code and provide a screenshot of the page.
6. Analyze the screenshot or search the dom to determine if the desired result was achieved.
7. Proceed with next step or adjust strategy if needed.
8. If you come to a point where you are not able to find the element after more than 3 retires, then stop for a sec and rewrite the plan based in the data from current screenshot, user messages and the actions taken so far and figure out a new way to get the task accomplished.

## How to plan actions:
1. You may not have a screenshot(blank page, white page) or a dom tree to query for initial request, use your judgement to figure out your first step carefully(DO not do any action that needs locator in the first step, maybe plan it for later.).
2. First step should always be to naviagte to a website, if we are not already at a website by executing just the page.goto function.
3. From second step on we can start doing multiple steps, if and only if we haev all the data like selectors to be able to execute.
4. At each step when executing playwright script try to do as little as poosible so we dont take any wrong action using assumptions that may not be true.
5. Always remember, never ever assume any locator when generating the playwright script, always use the available tools to find the appropriate locators first then only generate the playwright code.

## How to find locators for DOM element interaction:
1. Analyze the available screenshot of the current page and use the find_element tool/function/action to locate elements
2. The find_element tool will return detailed context including:
   - Element properties (text, role, attributes etc)
   - Full ancestry chain showing parent elements
   - Nearby sibling elements
3. Use this context to:
   - Build more reliable selectors based on unique parent-child relationships
   - Find elements relative to known landmarks in the DOM
   - Verify correct element identification using surrounding context
4. Try multiple strategies if initial attempt fails:
   - Start with specific attributes (id, testid)
   - Use role + text combinations
   - Build selectors using unique parent contexts
   - Reference nearby sibling elements for disambiguation
5. For the first initial request, you may not have a dom to query so use your judement and try not to do any dom interation for the first request, do all dom interactions from the second request.

## Instructions for generating correct playwright code:
1. When writing code to execute playwright, assume the page variable is present in the context of the execution.
2. Do not assume any locator when generating playwright script, always try to find it from the screenshot first then generate code for that locator.
3. Do not wrap the code in markdown code or a funtion, just keep it simple as multiple lines of playwright steps.

## Input
You will be provided user message/instructions, actions taken so far, screenshot of the current page and tools to query dom elements.
You will use these to determine where you are at in terms of plan of action and take appropriate next steps to complete the tasks.

### User message/instructions
{{userMessage}}

### Actions taken so far
{{actions}}

### Current DOM context
{{domContext}}

### Screenshot of the page
will be provided as attachment
`

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
  },
  {
    type: 'function',
    function: {
      name: 'find_element',
      description: 'Find an element in the DOM using various search strategies',
      parameters: {
        type: 'object',
        required: ['strategy'],
        properties: {
          strategy: {
            type: 'string',
            enum: ['text', 'role', 'testid', 'label', 'complex'],
            description: 'Search strategy to use'
          },
          query: {
            type: 'string',
            description: 'The search query (text content, role name, test id, etc.)'
          },
          nearText: {
            type: 'string',
            description: 'Find element near this text (optional)'
          },
          index: {
            type: 'number',
            description: 'Index if multiple elements match (optional)'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_element_details',
      description: 'Get detailed information about an element using its locator',
      parameters: {
        type: 'object',
        required: ['locator'],
        properties: {
          locator: {
            type: 'string',
            description: 'The playwright locator string'
          }
        }
      }
    }
  }
]
