/**
 * PartyDashboard Component
 * ========================
 * [HASEEB] This is your component to implement.
 * 
 * Main party overview page.
 */

import { useState, useEffect } from 'react'
// TODO: Import useParams from react-router-dom
// TODO: Import PartyMembers, PartyGoals, PartyLeaderboard components
// TODO: Import partyService

export default function PartyDashboard() {
  // TODO: Get party ID from URL
  // const { id } = useParams()
  
  // TODO: Set up state for party data
  const [party, setParty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // TODO: Set up active tab state
  const [activeTab, setActiveTab] = useState('overview')
  
  useEffect(() => {
    // TODO: Fetch party details
    // WHY: Load party data
    // APPROACH: await partyService.getParty(id)
  }, [])
  
  if (isLoading) {
    return <div className="text-center py-8">Loading party...</div>
  }
  
  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  }
  
  return (
    <div className="space-y-6">
      {/* Party Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-4">
          {/* TODO: Party avatar */}
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {/* First letter of party name */}
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {/* party?.name */}Party Name
            </h1>
            <p className="text-gray-500">
              {/* party?.description */}Party description
            </p>
          </div>
        </div>
        
        {/* Party stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {/* party?.memberCount */}0
            </p>
            <p className="text-sm text-gray-500">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {/* party?.totalPoints */}0
            </p>
            <p className="text-sm text-gray-500">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {/* party?.activeGoals */}0
            </p>
            <p className="text-sm text-gray-500">Active Goals</p>
          </div>
        </div>
        
        {/* TODO: Invite code (show to members) */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Invite Code:</p>
          <p className="font-mono font-bold">
            {/* party?.inviteCode */}ABC123
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-2">
        {['overview', 'members', 'goals', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* TODO: Render appropriate component based on activeTab */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Party Overview</h2>
            {/* TODO: Recent activity, party chat preview, etc. */}
            <p className="text-gray-500">Party activity and updates</p>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div>
            {/* TODO: <PartyMembers partyId={id} /> */}
            <p className="text-gray-500">Party members component</p>
          </div>
        )}
        
        {activeTab === 'goals' && (
          <div>
            {/* TODO: <PartyGoals partyId={id} /> */}
            <p className="text-gray-500">Party goals component</p>
          </div>
        )}
        
        {activeTab === 'leaderboard' && (
          <div>
            {/* TODO: <PartyLeaderboard partyId={id} /> */}
            <p className="text-gray-500">Party leaderboard component</p>
          </div>
        )}
      </div>
    </div>
  )
}

