/**
 * PartyGoals Component
 * ====================
 * Displays party goals, progress bars, and allows members to contribute.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import partyGoalService from '../../services/partyGoalService' // Assuming you create this service wrapper

export default function PartyGoals({ partyId }) {
  const [goals, setGoals] = useState([])
  const [filter, setFilter] = useState('ACTIVE') // Matches backend GoalStatus enum (ACTIVE, COMPLETED, etc.)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [contributingId, setContributingId] = useState(null)

  const fetchGoals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Backend expects 'status_filter' query param
      const data = await partyGoalService.getPartyGoals(partyId, filter === 'ALL' ? null : filter)
      setGoals(data)
    } catch (err) {
      console.error("Failed to fetch goals:", err)
      setError("Failed to load party goals.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (partyId) {
      fetchGoals()
    }
  }, [partyId, filter])

  const handleContribute = async (goalId) => {
    setContributingId(goalId)
    try {
      // Optimistic update
      const goalIndex = goals.findIndex(g => g.id === goalId)
      if (goalIndex === -1) return

      const previousGoals = [...goals]
      const updatedGoals = [...goals]
      
      // Optimistically increment value
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        current_value: updatedGoals[goalIndex].current_value + 1,
        // Recalculate percentage for UI smoothness
        progress_percentage: Math.min(100, ((updatedGoals[goalIndex].current_value + 1) / updatedGoals[goalIndex].target_value) * 100)
      }
      setGoals(updatedGoals)

      // Call API: Expects { increment: int }
      const response = await partyGoalService.contribute(goalId, 1)

      // Update with server response to ensure sync (especially for 'status' changes like COMPLETED)
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return {
            ...g,
            current_value: response.current_value,
            progress_percentage: response.progress_percentage,
            status: response.status,
            is_completed: response.is_completed // Backend might return this
          }
        }
        return g
      }))

    } catch (err) {
      console.error("Contribution failed:", err)
      fetchGoals() 
    } finally {
      setContributingId(null)
    }
  }

  const filters = [
    { id: 'ACTIVE', label: 'Active' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'ALL', label: 'All Goals' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Team Goals</h2>
        <Link 
          to={`/parties/${partyId}/goals/new`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
        >
          + New Goal
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-1">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-1 border-b-2 ${
              filter === f.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading goals...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
          <p className="text-gray-500">No {filter !== 'ALL' ? filter.toLowerCase() : ''} goals found.</p>
          {filter === 'ACTIVE' && (
            <p className="text-sm text-gray-400 mt-1">Create a new goal to get the party started!</p>
          )}
        </div>
      ) : (
        /* Goals List */
        <div className="grid gap-4">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                  )}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  goal.status === 'COMPLETED' 
                    ? 'bg-green-100 text-green-800' 
                    : goal.status === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {goal.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(goal.progress_percentage || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      goal.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${goal.progress_percentage || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{goal.current_value} completed</span>
                  <span>Target: {goal.target_value}</span>
                </div>
              </div>

              {/* Footer: Metadata & Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex gap-3 text-xs text-gray-500">
                  {goal.reward_points > 0 && (
                    <span className="flex items-center text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded">
                      🏆 {goal.reward_points} pts
                    </span>
                  )}
                  {goal.end_date && (
                    <span className="flex items-center bg-gray-50 px-2 py-1 rounded">
                      📅 Due {new Date(goal.end_date).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {goal.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleContribute(goal.id)}
                    disabled={contributingId === goal.id}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                  >
                    {contributingId === goal.id ? '...' : '+ Contribute'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}