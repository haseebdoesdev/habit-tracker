/**
 * PartyGoals Component
 * ====================
 * [NOUMAN] This is your component to implement.
 * 
 * Displays party goals and progress.
 */

import { useState, useEffect } from 'react'
// TODO: Import Link from react-router-dom
// TODO: Import partyGoalService

export default function PartyGoals({ partyId }) {
  // TODO: Set up state for goals
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // TODO: Filter state
  const [filter, setFilter] = useState('active')
  
  useEffect(() => {
    // TODO: Fetch party goals
    // WHY: Load goals for this party
    // APPROACH: await partyGoalService.getPartyGoals(partyId, filter)
  }, [partyId, filter])
  
  const handleContribute = async (goalId) => {
    // TODO: Add contribution to goal
    // WHY: Member contributes to goal progress
    // APPROACH: await partyGoalService.contribute(goalId, 1)
    
    // TODO: Refresh goals
    // WHY: Show updated progress
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Party Goals</h2>
        {/* TODO: Link to create goal */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + New Goal
        </button>
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
      
      {/* Goals list */}
      <div className="space-y-4">
        {/* TODO: Map through goals */}
        {/*
        {goals.map(goal => (
          <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{goal.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                goal.status === 'active' ? 'bg-green-100 text-green-600' :
                goal.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {goal.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-3">{goal.description}</p>
            
            {/* Progress bar */}
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${(goal.currentValue / goal.targetValue) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>{goal.currentValue} / {goal.targetValue}</span>
              <span>{Math.round((goal.currentValue / goal.targetValue) * 100)}%</span>
            </div>
            
            {/* Contribute button */}
            {goal.status === 'active' && (
              <button
                onClick={() => handleContribute(goal.id)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Contribute
              </button>
            )}
          </div>
        ))}
        */}
        
        <p className="text-gray-500">Party goals will appear here</p>
      </div>
    </div>
  )
}

