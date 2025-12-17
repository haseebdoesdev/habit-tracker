/**
 * PartyDashboard Component
 * Main party overview page
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LoadingState from '../Common/LoadingState'
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
    return <LoadingState message="Loading party..." fullPage />
  }

  if (error) {
    return <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">{error}</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Party Header */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-soft">
            {party?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-200">
              {party?.name || 'Party Name'}
            </h1>
            <p className="text-gray-400">
              {party?.description || 'No description'}
            </p>
          </div>
        </div>

        {/* Party stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-400">
              {party?.members?.length || party?.memberCount || 0}
            </p>
            <p className="text-sm text-gray-400">Members</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-solar-400">
              {party?.total_points || party?.totalPoints || 0}
            </p>
            <p className="text-sm text-gray-400">Total Points</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-sunset-400">
              {party?.goals?.length || party?.activeGoals || 0}
            </p>
            <p className="text-sm text-gray-400">Active Goals</p>
          </div>
        </div>

        {/* Invite code */}
        <div className="mt-4 p-3 bg-dark-300/50 rounded-soft border border-dark-400/50">
          <p className="text-sm text-gray-400">Invite Code:</p>
          <p className="font-mono font-bold text-gray-200">
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
            className={`px-4 py-2 rounded-organic capitalize transition-all ${
              activeTab === tab
                ? 'bg-accent-500 text-white shadow-soft'
                : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Party Overview</h2>
            <p className="text-gray-400">Party activity and updates will appear here</p>
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
