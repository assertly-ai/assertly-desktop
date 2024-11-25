import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import { Textarea } from '@components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { AgentMessage } from '@renderer/types/agent'
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
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const addMessage = (message: AgentMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) {
        return prev
      }
      return [...prev, message]
    })
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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

  useEffect(() => {
    const messageHandler = (_: unknown, message: AgentMessage) => {
      console.log('messageHandler', message)
      addMessage(message)
    }

    const questionHandler = (_: unknown, message: AgentMessage) => {
      console.log('questionHandler', message)
      addMessage(message)
      setIsWaitingForResponse(true)
    }

    const errorHandler = (_: unknown, message: AgentMessage) => {
      console.log('errorHandler', message)
      addMessage(message)
      setIsProcessing(false)
      setIsWaitingForResponse(false)
    }

    const completedHandler = (_: unknown, message: AgentMessage) => {
      console.log('completedHandler', message)
      addMessage(message)
      setIsProcessing(false)
      setIsWaitingForResponse(false)
    }

    const messageCleanup = window.electron.ipcRenderer.on(AgentEvents.MESSAGE, messageHandler)
    const questionCleanup = window.electron.ipcRenderer.on(AgentEvents.QUESTION, questionHandler)
    const errorCleanup = window.electron.ipcRenderer.on(AgentEvents.ERROR, errorHandler)
    const completedCleanup = window.electron.ipcRenderer.on(AgentEvents.COMPLETED, completedHandler)

    return () => {
      messageCleanup()
      questionCleanup()
      errorCleanup()
      completedCleanup()
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const message: AgentMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    }

    addMessage(message)
    setInput('')

    if (isWaitingForResponse) {
      window.api.sendUserResponse(message.content)
      setIsWaitingForResponse(false)
    } else {
      setIsProcessing(true)
      try {
        await window.api.startAgentInstruction(message.content)
      } catch (error) {
        addMessage({
          id: crypto.randomUUID(),
          type: 'system',
          content: `Error: ${error}`,
          timestamp: new Date().toISOString()
        })
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
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="flex flex-col h-screen p-2">
      <div className="py-1  px-2 border-b border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RiPlanetLine className="text-lg text-white/40" />
            <h1 className="text-md font-medium text-white/40">Explore</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-5"
                  onClick={handleNewSession}
                >
                  <FiPlus className="text-md text-white/40" />
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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 px-2
                        transition-all duration-200 backdrop-blur-sm
                        ${
                          message.type === 'user'
                            ? 'bg-white/[0.07] text-white/90 shadow-white/5 border border-white/5'
                            : ' text-white shadow-white/10 border border-white/10'
                        }`}
                >
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <div
                    className={`text-[10px] mt-1 ${
                      message.type === 'user' ? 'text-white/40' : 'text-white/40'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="py-2">
          <div className="flex max-w-5xl mx-auto relative group focus-visible:ring-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your instructions..."
              disabled={isProcessing}
              className="flex-1 min-h-[100px] max-h-[400px]
                          bg-neutral-500/10
                          shadow-lg
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
