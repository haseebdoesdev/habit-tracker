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
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-200">Party Goals</h2>
        <Link
          to={`/parties/${partyId}/goals/new`}
          className="btn-primary text-sm px-4 py-2"
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
            className={`px-3 py-1 rounded-organic capitalize transition-all ${
              filter === f
                ? 'bg-accent-500 text-white shadow-soft'
                : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic mb-4">{error}</div>
      )}
      
      {isLoading ? (
        <LoadingState message="Loading goals..." />
      ) : (
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">No goals found. Create your first goal!</p>
            </div>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className="card">
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
                    className="btn-primary bg-solar-500 hover:bg-solar-600 mt-3 text-sm px-4 py-2"
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

