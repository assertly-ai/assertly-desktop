import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import { Textarea } from '@components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { Message } from '@renderer/types/openai'
import { useEffect, useRef, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { RiPlanetLine, RiSendPlane2Line } from 'react-icons/ri'
export enum AgentEvents {
  MESSAGE = 'ai-agent:message',
  QUESTION = 'ai-agent:question',
  ERROR = 'ai-agent:error',
  EXECUTING = 'ai-agent:executing',
  COMPLETED = 'ai-agent:completed'
}

export const Explore = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  // Setup event listeners
  useEffect(() => {
    // Handler for assistant/system messages
    const messageHandler = (_, message: { type: 'assistant' | 'system'; content: string }) => {
      console.log('messageHandler')

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: message.content,
          sender: message.type,
          timestamp: new Date()
        }
      ])
    }

    // Handler for questions from the agent
    const questionHandler = (_, question: string) => {
      console.log('questionHandler')

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: question,
          sender: 'assistant',
          timestamp: new Date()
        }
      ])
      setIsWaitingForResponse(true)
    }

    // Handler for execution updates
    const executingHandler = (_, message: string) => {
      console.log('executingHandler')

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: `🔄 ${message}`,
          sender: 'system',
          timestamp: new Date()
        }
      ])
    }

    // Handler for errors
    const errorHandler = (_, error: Error) => {
      console.log('errorHandler')

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: `❌ Error: ${error.message}`,
          sender: 'system',
          timestamp: new Date()
        }
      ])
      setIsProcessing(false)
      setIsWaitingForResponse(false)
    }

    // Handler for completion
    const completedHandler = () => {
      console.log('completedHandler')

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: '✅ Task completed',
          sender: 'system',
          timestamp: new Date()
        }
      ])
      setIsProcessing(false)
      setIsWaitingForResponse(false)
    }

    // Register all event listeners
    window.electron.ipcRenderer.on(AgentEvents.MESSAGE, messageHandler)
    window.electron.ipcRenderer.on(AgentEvents.QUESTION, questionHandler)
    window.electron.ipcRenderer.on(AgentEvents.EXECUTING, executingHandler)
    window.electron.ipcRenderer.on(AgentEvents.ERROR, errorHandler)
    window.electron.ipcRenderer.on(AgentEvents.COMPLETED, completedHandler)
    return () => {
      window.electron.ipcRenderer.removeListener(AgentEvents.MESSAGE, messageHandler)
      window.electron.ipcRenderer.removeListener(AgentEvents.QUESTION, questionHandler)
      window.electron.ipcRenderer.removeListener(AgentEvents.EXECUTING, executingHandler)
      window.electron.ipcRenderer.removeListener(AgentEvents.ERROR, errorHandler)
      window.electron.ipcRenderer.removeListener(AgentEvents.COMPLETED, completedHandler)
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const message = input.trim()

    // Add user message to state immediately
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      }
    ])

    setInput('')

    if (isWaitingForResponse) {
      // Send as response to agent question
      window.api.sendUserResponse(message)
      setIsWaitingForResponse(false)
    } else {
      // Send as new instruction
      setIsProcessing(true)
      try {
        await window.api.startAgentInstruction(message)
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            content: `Error: ${error}`,
            sender: 'system',
            timestamp: new Date()
          }
        ])
        setIsProcessing(false)
      }
    }
  }

  const handleNewSession = () => {
    setMessages([])
    window.api.clearAgentContext()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set new height based on scrollHeight
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`
    }
  }

  // Update textarea height when input changes
  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-screen p-2 px-0">
      <div className="mb-2 mx-1 py-2 px-2 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RiPlanetLine className="text-xl text-white/40" />
            <h1 className="text-lg font-semibold text-white/40">Explore</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-6"
                  onClick={handleNewSession}
                >
                  <FiPlus className="text-2xl text-white/40" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-[#1a1a1a] text-[11px] rounded-lg p-2">
                <p className="text-white">Start a new session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0">
        <ScrollArea
          className="flex-1 scrollbar-hide"
          ref={scrollAreaRef}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="flex flex-col gap-4 py-4 px-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 px-2
                        transition-all duration-200 backdrop-blur-sm
                        ${
                          message.sender === 'user'
                            ? 'bg-white/[0.07] text-white/90 shadow-white/5 border border-white/5'
                            : ' text-white shadow-white/10 border border-white/10'
                        }`}
                >
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div
                    className={`text-[10px] mt-1 ${
                      message.sender === 'user' ? 'text-white/40' : 'text-white/40'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="">
          <div className="flex max-w-5xl mx-auto relative group focus-visible:ring-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your instructions..."
              disabled={isProcessing}
              className="flex-1 min-h-[120px] max-h-[400px]
                          bg-neutral-800/90
                          border border-white/15
                          text-white placeholder:text-white/40
                          resize-none rounded-lg pr-14 pl-5 py-3.5 text-[15px]
                          overflow-hidden
                          disabled:opacity-50
                          "
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className={`absolute right-2 bottom-2 h-[38px] w-[38px] p-0
                          rounded-lg
                          backdrop-blur-sm outline-none
                          ${
                            input.trim() && !isProcessing
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-white/5 text-white/30 border border-white/5'
                          }`}
            >
              <RiSendPlane2Line
                className={`h-4 w-4 transition-transform duration-200
                            ${input.trim() && !isProcessing ? 'scale-100' : 'scale-90'}
                          `}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
