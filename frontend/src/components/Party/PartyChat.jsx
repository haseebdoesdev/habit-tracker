/**
 * PartyChat Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Party activity feed/chat.
 */

import { useState } from 'react'

export default function PartyChat({ partyId }) {
  const [newMessage, setNewMessage] = useState('')
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) {
      return
    }
    
    // Note: Party chat functionality is not yet implemented on the backend
    // This is a placeholder for future implementation
    setNewMessage('')
  }
  
  return (
    <div className="flex flex-col h-96">
      <h2 className="text-lg font-semibold mb-4">Party Activity</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Party chat functionality is coming soon!</p>
          <p className="text-sm">This feature will allow party members to communicate and share updates.</p>
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Chat coming soon..."
          disabled
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        />
        <button
          type="submit"
          disabled
          className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}

