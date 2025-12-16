/**
 * PartyLeaderboard Component
 * ==========================
 * [OMAMAH] This is your component to implement.
 * 
 * Displays party member rankings.
 */

import { useState, useEffect } from 'react'
import LoadingState from '../Common/LoadingState'
import partyService from '../../services/partyService'

export default function PartyLeaderboard({ partyId }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const members = await partyService.getPartyMembers(partyId)
        // Sort by contribution points descending
        const sorted = Array.isArray(members) 
          ? [...members].sort((a, b) => (b.contribution_points || 0) - (a.contribution_points || 0))
          : []
        setLeaderboard(sorted)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (partyId) {
      fetchLeaderboard()
    }
  }, [partyId])
  
  if (isLoading) {
    return <LoadingState message="Loading leaderboard..." />
  }
  
  if (error) {
    return <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Party Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No members found.</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member, index) => (
            <div 
              key={member.id || member.user_id} 
              className={`flex items-center justify-between p-4 rounded-lg ${
                index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                index === 1 ? 'bg-gray-100' :
                index === 2 ? 'bg-orange-50' :
                'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-400 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {member.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="font-medium">{member.username || 'Unknown'}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{member.contribution_points || member.contributionPoints || 0}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

