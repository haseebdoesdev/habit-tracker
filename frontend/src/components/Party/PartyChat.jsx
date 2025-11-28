/**
 * PartyChat Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Party activity feed/chat.
 */

import { useState, useEffect } from 'react'
// TODO: Import partyService

export default function PartyChat({ partyId }) {
  // TODO: Set up state for messages/activity
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch party activity/messages
    // WHY: Load chat history
    // APPROACH: await partyService.getPartyActivity(partyId)
  }, [partyId])
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    // TODO: Validate message
    // WHY: Don't send empty messages
    
    // TODO: Send message to API
    // WHY: Persist and broadcast
    // APPROACH: await partyService.sendMessage(partyId, newMessage)
    
    // TODO: Add to local messages
    // WHY: Immediate feedback
    
    // TODO: Clear input
    // WHY: Ready for next message
  }
  
  return (
    <div className="flex flex-col h-96">
      <h2 className="text-lg font-semibold mb-4">Party Activity</h2>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No activity yet. Start the conversation!
          </div>
        ) : (
          /* TODO: Map through messages */
          /*
          {messages.map(msg => (
            <div key={msg.id} className="flex space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm">
                {msg.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium">{msg.username}</span>
                  <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="text-gray-700">{msg.content}</p>
              </div>
            </div>
          ))}
          */
          <p className="text-gray-500">Chat messages will appear here</p>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  )
}

