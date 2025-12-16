/**
 * PartyMembers Component
 * ======================
 * [HASEEB] This is your component to implement.
 * 
 * Displays list of party members.
 */

import { useState, useEffect } from 'react'
import LoadingState from '../Common/LoadingState'
import partyService from '../../services/partyService'

export default function PartyMembers({ partyId }) {
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        const data = await partyService.getPartyMembers(partyId)
        setMembers(data)
      } catch (err) {
        console.error("Failed to load party members:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (partyId) {
      fetchMembers()
    }
  }, [partyId])
  
  if (isLoading) {
    return <LoadingState message="Loading members..." />
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Members</h2>
        <span className="text-gray-500">{members.length} members</span>
      </div>
      
      {/* Member list */}
      <div className="space-y-3">
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
              <p className="font-bold text-blue-600">{member.contribution_points}</p>
              <p className="text-xs text-gray-500">points</p>
            </div>
          </div>
        ))}
        
        {members.length === 0 && !isLoading && (
          <p className="text-gray-500">No members found.</p>
        )}
      </div>
    </div>
  )
}

