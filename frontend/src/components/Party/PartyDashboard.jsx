/**
 * PartyDashboard Component
 * Main party overview page
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import partyService from '../../services/partyService'
import PartyMembers from './PartyMembers'
import PartyGoals from './PartyGoals'
import PartyLeaderboard from './PartyLeaderboard'

export default function PartyDashboard() {
  const { id } = useParams()

  const [party, setParty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchParty = async () => {
      try {
        setIsLoading(true)
        const data = await partyService.getParty(id)
        setParty(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load party')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchParty()
    }
  }, [id])

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
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {party?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {party?.name || 'Party Name'}
            </h1>
            <p className="text-gray-500">
              {party?.description || 'No description'}
            </p>
          </div>
        </div>

        {/* Party stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {party?.members?.length || party?.memberCount || 0}
            </p>
            <p className="text-sm text-gray-500">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {party?.total_points || party?.totalPoints || 0}
            </p>
            <p className="text-sm text-gray-500">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {party?.goals?.length || party?.activeGoals || 0}
            </p>
            <p className="text-sm text-gray-500">Active Goals</p>
          </div>
        </div>

        {/* Invite code */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Invite Code:</p>
          <p className="font-mono font-bold">
            {party?.invite_code || party?.inviteCode || 'N/A'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {['overview', 'members', 'goals', 'leaderboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab
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
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Party Overview</h2>
            <p className="text-gray-500">Party activity and updates will appear here</p>
          </div>
        )}

        {activeTab === 'members' && (
          <PartyMembers partyId={id} />
        )}

        {activeTab === 'goals' && (
          <PartyGoals partyId={id} />
        )}

        {activeTab === 'leaderboard' && (
          <PartyLeaderboard partyId={id} />
        )}
      </div>
    </div>
  )
}
