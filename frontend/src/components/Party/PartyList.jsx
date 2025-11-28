/**
 * PartyList Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Browse and search for parties to join.
 */

import { useState, useEffect } from 'react'
// TODO: Import Link from react-router-dom
// TODO: Import partyService

export default function PartyList() {
  // TODO: Set up state for parties
  const [myParties, setMyParties] = useState([])
  const [publicParties, setPublicParties] = useState([])
  
  // TODO: Set up state for invite code input
  const [inviteCode, setInviteCode] = useState('')
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // TODO: Fetch user's parties
    // WHY: Show parties user belongs to
    // APPROACH: await partyService.getParties()
    
    // TODO: Fetch public parties
    // WHY: Show joinable parties
    // APPROACH: await partyService.getParties({ publicOnly: true })
  }, [])
  
  const handleJoinWithCode = async (e) => {
    e.preventDefault()
    
    // TODO: Validate invite code
    // WHY: Ensure code is provided
    
    // TODO: Call join API
    // WHY: Join party with code
    // APPROACH: await partyService.joinParty(inviteCode)
    
    // TODO: Handle success
    // WHY: Navigate to joined party
    
    // TODO: Handle errors
    // WHY: Invalid code, party full, etc.
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
        {/* TODO: Link to create party */}
        <a
          href="/parties/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Party
        </a>
      </div>
      
      {/* Join with invite code */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-medium mb-3">Join with Invite Code</h3>
        <form onSubmit={handleJoinWithCode} className="flex space-x-3">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Join
          </button>
        </form>
      </div>
      
      {/* My Parties */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Parties</h2>
        {/* TODO: Map through myParties */}
        {myParties.length === 0 ? (
          <p className="text-gray-500">You haven't joined any parties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TODO: Party cards */}
            <p className="text-gray-500">Your parties will appear here</p>
          </div>
        )}
      </div>
      
      {/* Public Parties */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Public Parties</h2>
        {/* TODO: Map through publicParties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TODO: Party cards with join button */}
          <p className="text-gray-500">Public parties will appear here</p>
        </div>
      </div>
    </div>
  )
}

