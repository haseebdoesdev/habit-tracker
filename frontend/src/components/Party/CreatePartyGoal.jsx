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
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">Create Party Goal</h1>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Goal Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Complete 500 habits together"
            className="input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the goal..."
            className="input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Target Value *
          </label>
          <input
            name="targetValue"
            type="number"
            min="1"
            value={formData.targetValue}
            onChange={handleChange}
            className="input"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Total completions needed to achieve the goal
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Start Date
            </label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              End Date
            </label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Reward Points
          </label>
          <input
            name="rewardPoints"
            type="number"
            min="0"
            value={formData.rewardPoints}
            onChange={handleChange}
            className="input"
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
            className="btn-primary flex-1"
          >
            {isLoading ? 'Creating...' : 'Create Goal'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

