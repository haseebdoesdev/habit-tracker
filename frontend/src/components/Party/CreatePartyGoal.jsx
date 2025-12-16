/**
 * CreatePartyGoal Component
 * =========================
 * [NOUMAN] This is your component to implement.
 * 
 * Form for creating a new party goal.
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import partyGoalService from '../../services/partyGoalService'
import { validateRequired, validatePositiveNumber, validateDateRange } from '../../utils/validators'

export default function CreatePartyGoal() {
  const { id: partyId } = useParams()
  const navigate = useNavigate()
  
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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate required fields
    const titleValidation = validateRequired(formData.title, 'Title')
    if (!titleValidation.valid) {
      setError(titleValidation.message)
      return
    }
    
    const targetValidation = validatePositiveNumber(formData.targetValue, 'Target value')
    if (!targetValidation.valid) {
      setError(targetValidation.message)
      return
    }
    
    // Validate dates if provided
    if (formData.startDate && formData.endDate) {
      const dateValidation = validateDateRange(formData.startDate, formData.endDate)
      if (!dateValidation.valid) {
        setError(dateValidation.message)
        return
      }
    }
    
    setIsLoading(true)
    
    try {
      await partyGoalService.createGoal(partyId, {
        title: formData.title,
        description: formData.description || null,
        targetValue: parseInt(formData.targetValue),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        rewardPoints: parseInt(formData.rewardPoints) || 0
      })
      navigate(`/parties/${partyId}`)
    } catch (err) {
      setError(err.message || 'Failed to create goal')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Party Goal</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Complete 500 habits together"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the goal..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Value *
          </label>
          <input
            name="targetValue"
            type="number"
            min="1"
            value={formData.targetValue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Total completions needed to achieve the goal
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reward Points
          </label>
          <input
            name="rewardPoints"
            type="number"
            min="0"
            value={formData.rewardPoints}
            onChange={handleChange}
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

