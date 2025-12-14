/**
 * CreatePartyGoal Component
 * =========================
 * Form for creating a new collective party goal.
 */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import partyGoalService from '../../services/partyGoalService'

export default function CreatePartyGoal() {
  const { id: partyId } = useParams() // Expecting route /parties/:id/goals/new
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 100,
    startDate: new Date().toISOString().split('T')[0], // Default to today
    endDate: '',
    rewardPoints: 50,
    habitCategory: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      setIsLoading(false)
      return
    }
    if (formData.targetValue <= 0) {
      setError('Target value must be greater than 0')
      setIsLoading(false)
      return
    }
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be before start date')
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        party_id: parseInt(partyId),
        title: formData.title,
        description: formData.description,
        target_value: parseInt(formData.targetValue),
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        reward_points: parseInt(formData.rewardPoints),
        habit_category: formData.habitCategory || null
      }

      await partyGoalService.createGoal(payload)
      
      navigate(`/parties/${partyId}`)
    } catch (err) {
      console.error("Failed to create goal:", err)
      const msg = err.response?.data?.detail || "Failed to create party goal."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Party Goal</h1>
        <p className="text-gray-500">Set a collective target for your team to achieve together.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g., Complete 500 Workouts"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Describe the challenge..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Target Value & Reward Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-1">
              Target Value *
            </label>
            <div className="relative">
              <input
                id="targetValue"
                name="targetValue"
                type="number"
                min="1"
                required
                value={formData.targetValue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-sm">completions</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Total combined actions needed</p>
          </div>

          <div>
            <label htmlFor="rewardPoints" className="block text-sm font-medium text-gray-700 mb-1">
              Reward Points
            </label>
            <input
              id="rewardPoints"
              name="rewardPoints"
              type="number"
              min="0"
              value={formData.rewardPoints}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Points added to party total on success</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Habit Category */}
        <div>
          <label htmlFor="habitCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Category Focus
          </label>
          <select
            id="habitCategory"
            name="habitCategory"
            value={formData.habitCategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Any Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Optional: Restrict contributions to specific habit types</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
          >
            {isLoading ? 'Creating Goal...' : 'Create Goal'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/parties/${partyId}`)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}