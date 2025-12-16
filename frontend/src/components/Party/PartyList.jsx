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
      // Refresh parties list after joining
      const allParties = await partyService.getParties()
      setMyParties(Array.isArray(allParties) ? allParties : [])
      
      // Navigate to the party if we have the ID
      const partyId = result.party_id || result.id || result.party?.id
      if (partyId) {
        navigate(`/parties/${partyId}`)
      } else {
        // If no ID, just refresh the list
        const publicOnly = await partyService.getParties({ publicOnly: true })
        setPublicParties(Array.isArray(publicOnly) ? publicOnly : [])
      }
    } catch (err) {
      setJoinError(err.message || 'Failed to join party')
    }
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-200">Parties</h1>
        <Link
          to="/parties/new"
          className="btn-primary"
        >
          Create Party
        </Link>
      </div>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic mb-4">{error}</div>
      )}
      
      <div className="card">
        <h3 className="font-medium text-gray-200 mb-3">Join with Invite Code</h3>
        <form onSubmit={handleJoinWithCode} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code"
            className="input flex-1"
          />
          <button
            type="submit"
            className="btn-primary bg-solar-500 hover:bg-solar-600"
          >
            Join
          </button>
        </form>
        {joinError && (
          <p className="text-terracotta-300 text-sm mt-2">{joinError}</p>
        )}
      </div>
      
      {isLoading ? (
        <LoadingState message="Loading parties..." />
      ) : (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-4">My Parties</h2>
            {myParties.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">You haven't joined any parties yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myParties.map(party => (
                  <Link
                    key={party.id}
                    to={`/parties/${party.id}`}
                    className="card-hover"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-200">{party.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{party.description || 'No description'}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{party.member_count || party.members?.length || 0} members</span>
                      <span className="text-accent-400">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Public Parties</h2>
            {publicParties.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-text">No public parties available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publicParties.map(party => (
                  <div
                    key={party.id}
                    className="card"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-200">{party.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">{party.description || 'No description'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{party.member_count || party.members?.length || 0} members</span>
                      <Link
                        to={`/parties/${party.id}`}
                        className="btn-primary text-sm px-4 py-2"
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

