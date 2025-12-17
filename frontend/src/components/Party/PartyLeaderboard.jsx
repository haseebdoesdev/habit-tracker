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
    return <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic">{error}</div>
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">Party Leaderboard</h2>
      
      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">No members found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member, index) => (
            <div 
              key={member.id || member.user_id} 
              className={`card flex items-center justify-between ${
                index === 0 ? 'bg-sunset-600/20 border-sunset-500/50' :
                index === 1 ? 'bg-dark-300/50' :
                index === 2 ? 'bg-sunset-600/10 border-sunset-500/30' :
                ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-soft ${
                  index === 0 ? 'bg-gradient-to-br from-sunset-500 to-sunset-600 text-white' :
                  index === 1 ? 'bg-dark-400 text-gray-300' :
                  index === 2 ? 'bg-sunset-600/50 text-sunset-300' :
                  'bg-dark-400 text-gray-400'
                }`}>
                  {index + 1}
                </span>
                <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white shadow-soft">
                  {member.username?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="font-medium text-gray-200">{member.username || 'Unknown'}</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent-400">{member.contribution_points || member.contributionPoints || 0}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

