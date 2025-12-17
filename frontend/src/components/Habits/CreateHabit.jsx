/**
 * CreateHabit Component
 * =====================
 * [OMAMAH] This is your component to implement.
 * 
 * Form for creating a new habit.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import habitService from '../../services/habitService'

export default function CreateHabit() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    category: '',
    reminderTime: '',
    color: '#3B82F6'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom Days' }
  ]
  
  const categoryOptions = [
    'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Other'
  ]
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    
    setIsLoading(true)
    
    try {
      await habitService.createHabit(formData)
      navigate('/habits')
    } catch (err) {
      setError(err.message || 'Failed to create habit')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">Create New Habit</h1>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Habit Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Morning meditation"
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
            placeholder="Why is this habit important to you?"
            className="input resize-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="input"
          >
            {frequencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select a category</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Reminder Time (optional)
          </label>
          <input
            name="reminderTime"
            type="time"
            value={formData.reminderTime}
            onChange={handleChange}
            className="input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Color
          </label>
          <input
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            className="h-10 w-20 rounded-soft cursor-pointer border border-dark-400"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? 'Creating...' : 'Create Habit'}
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

