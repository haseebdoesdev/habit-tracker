/**
 * PartyMembers Component
 * ======================
 * [HASEEB] This is your component to implement.
 * 
 * Displays list of party members.
 */

import { useState, useEffect } from 'react'
// TODO: Import partyService

export default function PartyMembers({ partyId }) {
  // TODO: Set up state for members
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch party members
    // WHY: Load member list
    // APPROACH: await partyService.getPartyMembers(partyId)
  }, [partyId])
  
  if (isLoading) {
    return <div className="text-center py-4">Loading members...</div>
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Members</h2>
        <span className="text-gray-500">{members.length} members</span>
      </div>
      
      {/* Member list */}
      <div className="space-y-3">
        {/* TODO: Map through members */}
        {/*
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{member.username}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-600">{member.contributionPoints}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
        */}
        
        <p className="text-gray-500">Member list will appear here</p>
      </div>
    </div>
  )
}

