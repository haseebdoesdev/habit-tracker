/**
 * PartyList Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Browse and search for parties to join.
 */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingState from '../Common/LoadingState'
import partyService from '../../services/partyService'

export default function PartyList() {
  const navigate = useNavigate()
  
  const [myParties, setMyParties] = useState([])
  const [publicParties, setPublicParties] = useState([])
  
  const [inviteCode, setInviteCode] = useState('')
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [joinError, setJoinError] = useState(null)
  
  useEffect(() => {
    const fetchParties = async () => {
      try {
        setIsLoading(true)
        const allParties = await partyService.getParties()
        const publicOnly = await partyService.getParties({ publicOnly: true })
        
        // Separate user's parties from public parties
        setMyParties(Array.isArray(allParties) ? allParties : [])
        setPublicParties(Array.isArray(publicOnly) ? publicOnly : [])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load parties')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchParties()
  }, [])
  
  const handleJoinWithCode = async (e) => {
    e.preventDefault()
    setJoinError(null)
    
    if (!inviteCode.trim()) {
      setJoinError('Please enter an invite code')
      return
    }
    
    try {
      const result = await partyService.joinParty(inviteCode)
      setInviteCode('')
      navigate(`/parties/${result.id || result.party?.id}`)
    } catch (err) {
      setJoinError(err.message || 'Failed to join party')
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parties</h1>
        <Link
          to="/parties/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Party
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}
      
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
        {joinError && (
          <p className="text-red-600 text-sm mt-2">{joinError}</p>
        )}
      </div>
      
      {isLoading ? (
        <LoadingState message="Loading parties..." />
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-4">My Parties</h2>
            {myParties.length === 0 ? (
              <p className="text-gray-500">You haven't joined any parties yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myParties.map(party => (
                  <Link
                    key={party.id}
                    to={`/parties/${party.id}`}
                    className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2">{party.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{party.description || 'No description'}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{party.member_count || party.members?.length || 0} members</span>
                      <span className="text-blue-600">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Public Parties</h2>
            {publicParties.length === 0 ? (
              <p className="text-gray-500">No public parties available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicParties.map(party => (
                  <div
                    key={party.id}
                    className="bg-white rounded-xl shadow p-4"
                  >
                    <h3 className="font-semibold text-lg mb-2">{party.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{party.description || 'No description'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">{party.member_count || party.members?.length || 0} members</span>
                      <Link
                        to={`/parties/${party.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

