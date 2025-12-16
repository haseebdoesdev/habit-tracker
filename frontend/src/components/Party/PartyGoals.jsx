/**
 * PartyGoals Component
 * ====================
 * [NOUMAN] This is your component to implement.
 * 
 * Displays party goals and progress.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingState from '../Common/LoadingState'
import partyGoalService from '../../services/partyGoalService'

export default function PartyGoals({ partyId }) {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filter, setFilter] = useState('active')
  
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true)
        const data = await partyGoalService.getPartyGoals(partyId, filter)
        setGoals(data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load goals')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (partyId) {
      fetchGoals()
    }
  }, [partyId, filter])
  
  const handleContribute = async (goalId) => {
    try {
      await partyGoalService.contribute(goalId, 1)
      // Refresh goals to show updated progress
      const data = await partyGoalService.getPartyGoals(partyId, filter)
      setGoals(data)
    } catch (err) {
      setError(err.message || 'Failed to contribute to goal')
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Party Goals</h2>
        <Link
          to={`/parties/${partyId}/goals/new`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Goal
        </Link>
      </div>
      
      {/* Filter tabs */}
      <div className="flex space-x-2">
        {['active', 'completed', 'all'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg capitalize ${
              filter === f
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}
      
      {isLoading ? (
        <LoadingState message="Loading goals..." />
      ) : (
        <div className="space-y-4">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No goals found. Create your first goal!</p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    goal.status === 'ACTIVE' ? 'bg-green-100 text-green-600' :
                    goal.status === 'COMPLETED' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {goal.status}
                  </span>
                </div>
                {goal.description && (
                  <p className="text-gray-500 text-sm mb-3">{goal.description}</p>
                )}
                
                {/* Progress bar */}
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${goal.progress_percentage || 0}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                  <span>{goal.current_value} / {goal.target_value}</span>
                  <span>{Math.round(goal.progress_percentage || 0)}%</span>
                </div>
                
                {/* Contribute button */}
                {goal.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleContribute(goal.id)}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Contribute
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

