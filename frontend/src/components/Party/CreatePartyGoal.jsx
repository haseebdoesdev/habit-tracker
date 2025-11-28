/**
 * CreatePartyGoal Component
 * =========================
 * [NOUMAN] This is your component to implement.
 * 
 * Form for creating a new party goal.
 */

import { useState } from 'react'
// TODO: Import useNavigate, useParams from react-router-dom
// TODO: Import partyGoalService

export default function CreatePartyGoal() {
  // TODO: Get party ID from params or props
  
  // TODO: Set up form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 100,
    startDate: '',
    endDate: '',
    rewardPoints: 50
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleChange = (e) => {
    // TODO: Update form data
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Validate form
    // WHY: Ensure valid data
    // Check: title, targetValue, dates
    
    // TODO: Validate dates
    // WHY: End date must be after start date
    
    // TODO: Call API to create goal
    // WHY: Persist goal to backend
    // APPROACH: await partyGoalService.createGoal(partyId, formData)
    
    // TODO: Navigate back to party
    // WHY: Show the new goal
    
    // TODO: Handle errors
    // WHY: Show error message
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Party Goal</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title *
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g., Complete 500 habits together"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Describe the goal..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Target value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Value *
          </label>
          <input
            name="targetValue"
            type="number"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Total completions needed to achieve the goal
          </p>
        </div>
        
        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              name="startDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              name="endDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Reward points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reward Points
          </label>
          <input
            name="rewardPoints"
            type="number"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Points awarded to party when goal is completed
          </p>
        </div>
        
        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Goal'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

