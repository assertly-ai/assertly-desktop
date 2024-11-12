import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import { Textarea } from '@components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import { RiSendPlane2Line, RiSendPlaneFill } from 'react-icons/ri'

type Message = {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export const Explore = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
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
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px'
    }

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: 'This is a sample response from the assistant.',
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white/50">Explore</h2>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Messages Area */}
        <ScrollArea
          className="flex-1 px-4"
          ref={scrollAreaRef}
          style={{ height: 'calc(100vh - 160px)' }} // Adjust based on header + input heights
        >
          <div className="flex flex-col gap-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3
                    shadow-sm transition-all duration-200 backdrop-blur-sm
                    ${
                      message.sender === 'user'
                        ? 'bg-orange-600 text-white shadow-white/10 border border-orange-400/10'
                        : 'bg-white/[0.07] text-white/90 shadow-white/5 border border-white/5'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex max-w-5xl mx-auto relative group focus-visible:ring-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[52px] max-h-[200px]
                bg-white/[0.06] hover:bg-white/[0.08]
                border-none
                focus-within:border-transparent
                text-white placeholder:text-white/40
                resize-none rounded-xl pr-14 pl-5 py-3.5 text-[15px]
                focus:bg-white/[0.08]
                "
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`absolute right-2 bottom-2 h-[38px] w-[38px] p-0
                rounded-xl transition-all duration-200 ease-in-out
                backdrop-blur-sm outline-none
                ${
                  input.trim()
                    ? 'bg-white/10 hover:bg-white/15 text-white shadow-sm shadow-white/10 border border-white/10 hover:border-white/20'
                    : 'bg-white/5 text-white/30 border border-white/5'
                }`}
            >
              <RiSendPlane2Line
                className={`h-4 w-4 transition-transform duration-200
                  ${input.trim() ? 'scale-100' : 'scale-90'}
                `}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
