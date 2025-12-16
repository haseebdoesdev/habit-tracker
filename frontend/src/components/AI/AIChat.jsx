/**
 * AI Chat Component
 * =================
 * Chat interface for talking with AI about habits.
 */

import { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../Common/LoadingSpinner'
import aiService from '../../services/aiService'

// Chat icon component
function ChatIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

export default function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setError(null)

    // Add user message
    const newUserMessage = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const response = await aiService.chat(userMessage)
      const aiMessage = { 
        role: 'assistant', 
        content: response.response || response.message || 'I apologize, but I couldn\'t process that request.' 
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      setError(err.message || 'Failed to get AI response')
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-dark-400/50 bg-gradient-to-r from-accent-600/20 to-dark-200/50">
        <div className="flex items-center gap-2">
          <ChatIcon className="w-5 h-5 text-accent-400" />
          <h2 className="text-lg font-semibold text-gray-200">Chat with AI</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Ask questions about your habits, get tips, or discuss your progress
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p className="mb-2">Start a conversation with AI</p>
            <p className="text-sm">Try asking: "How can I improve my habit consistency?"</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-soft p-3 ${
                message.role === 'user'
                  ? 'bg-accent-500 text-white'
                  : 'bg-dark-300 text-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-300 rounded-soft p-3">
              <LoadingSpinner size="sm" message="AI is thinking..." />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-soft text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-dark-400/50">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}



