/**
 * EditHabit Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Form for editing an existing habit.
 */

import { useState, useEffect } from 'react'
// TODO: Import useParams, useNavigate from react-router-dom
// TODO: Import habitService

export default function EditHabit() {
  // TODO: Get habit ID from URL params
  // WHY: Know which habit to edit
  // APPROACH: const { id } = useParams()
  
  // TODO: Set up form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    category: '',
    reminderTime: '',
    color: '#3B82F6',
    isActive: true
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    // TODO: Fetch habit data on mount
    // WHY: Populate form with existing values
    // APPROACH: habitService.getHabit(id)
    
    // TODO: Set form data from fetched habit
    // WHY: Pre-fill the form
    
    // TODO: Handle not found errors
    // WHY: Habit might not exist
  }, [])
  
  const handleChange = (e) => {
    // TODO: Update form data
    // WHY: Track user changes
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Validate form
    // WHY: Ensure valid data
    
    // TODO: Set saving state
    // WHY: Show progress
    
    // TODO: Call API to update habit
    // WHY: Persist changes
    // APPROACH: await habitService.updateHabit(id, formData)
    
    // TODO: Handle success
    // WHY: Navigate back to habits
    
    // TODO: Handle errors
    // WHY: Show error message
  }
  
  const handleDelete = async () => {
    // TODO: Confirm deletion
    // WHY: Prevent accidental deletes
    // APPROACH: Show confirmation dialog
    
    // TODO: Call API to delete
    // WHY: Remove habit
    // APPROACH: await habitService.deleteHabit(id)
    
    // TODO: Navigate to habit list
    // WHY: Habit no longer exists
  }
  
  if (isLoading) {
    return <div className="text-center py-8">Loading habit...</div>
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Habit</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* TODO: Same form fields as CreateHabit */}
        {/* WHY: Consistent editing experience */}
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habit Title *
          </label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* TODO: Add remaining form fields */}
        {/* Description, Frequency, Category, Reminder, Color */}
        
        {/* TODO: Active toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange({ target: { name: 'isActive', value: e.target.checked }})}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label className="text-sm text-gray-700">
            Active (uncheck to pause this habit)
          </label>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        
        {/* TODO: Delete button */}
        <div className="pt-4 border-t">
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete Habit
          </button>
        </div>
      </form>
    </div>
  )
}

