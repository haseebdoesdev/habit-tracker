/**
 * CreateHabit Component
 * =====================
 * [OMAMAH] This is your component to implement.
 * 
 * Form for creating a new habit.
 */

import { useState } from 'react'
// TODO: Import useNavigate from react-router-dom
// TODO: Import habitService

export default function CreateHabit() {
  // TODO: Set up form state
  // WHY: Track all habit fields
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
  
  // TODO: Define frequency options
  // WHY: Dropdown choices for habit frequency
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom Days' }
  ]
  
  // TODO: Define category options
  // WHY: Organize habits by type
  const categoryOptions = [
    'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Other'
  ]
  
  const handleChange = (e) => {
    // TODO: Update form data on change
    // WHY: Keep state synced with inputs
    // APPROACH: setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Validate form
    // WHY: Ensure required fields are filled
    // APPROACH: Check title is not empty
    
    // TODO: Set loading state
    // WHY: Show progress to user
    
    // TODO: Call API to create habit
    // WHY: Persist habit to backend
    // APPROACH: await habitService.createHabit(formData)
    
    // TODO: Handle success
    // WHY: Navigate to habit list or dashboard
    // APPROACH: navigate('/habits')
    
    // TODO: Handle errors
    // WHY: Show error message to user
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Habit</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* TODO: Title input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habit Title *
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g., Morning meditation"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* TODO: Description textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Why is this habit important to you?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* TODO: Frequency select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            name="frequency"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {/* TODO: Map frequency options */}
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom Days</option>
          </select>
        </div>
        
        {/* TODO: Category select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {/* TODO: Map category options */}
          </select>
        </div>
        
        {/* TODO: Reminder time input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Time (optional)
          </label>
          <input
            name="reminderTime"
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* TODO: Color picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            name="color"
            type="color"
            className="h-10 w-20 rounded cursor-pointer"
          />
        </div>
        
        {/* TODO: Submit buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Habit'}
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

