/**
 * PartyLeaderboard Component
 * ==========================
 * [OMAMAH] This is your component to implement.
 * 
 * Displays party member rankings.
 */

import { useState, useEffect } from 'react'
// TODO: Import partyService

export default function PartyLeaderboard({ partyId }) {
  // TODO: Set up state for leaderboard
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch party leaderboard
    // WHY: Get ranked member list
    // APPROACH: await partyService.getPartyMembers(partyId) ordered by points
  }, [partyId])
  
  if (isLoading) {
    return <div className="text-center py-4">Loading leaderboard...</div>
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Party Leaderboard</h2>
      
      {/* TODO: Leaderboard table/list */}
      <div className="space-y-2">
        {/* TODO: Map through leaderboard */}
        {/*
        {leaderboard.map((member, index) => (
          <div 
            key={member.id} 
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
                {member.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{member.username}</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">{member.contributionPoints}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
        */}
        
        <p className="text-gray-500">Leaderboard will appear here</p>
      </div>
    </div>
  )
}

