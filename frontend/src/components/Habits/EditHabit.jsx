/**
 * EditHabit Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Form for editing an existing habit.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingState from '../Common/LoadingState'
import habitService from '../../services/habitService'
import HabitLogs from './HabitLogs'

export default function EditHabit() {
  const { id } = useParams()
  const navigate = useNavigate()
  
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
    const fetchHabit = async () => {
      try {
        setIsLoading(true)
        const habit = await habitService.getHabit(id)
        setFormData({
          title: habit.title || '',
          description: habit.description || '',
          frequency: habit.frequency || 'daily',
          category: habit.category || '',
          reminderTime: habit.reminder_time || habit.reminderTime || '',
          color: habit.color || '#3B82F6',
          isActive: habit.is_active !== undefined ? habit.is_active : (habit.isActive !== undefined ? habit.isActive : true)
        })
        setError(null)
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Habit not found')
        } else {
          setError(err.message || 'Failed to load habit')
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchHabit()
    }
  }, [id])
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    
    setIsSaving(true)
    
    try {
      await habitService.updateHabit(id, formData)
      navigate('/habits')
    } catch (err) {
      setError(err.message || 'Failed to update habit')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      return
    }
    
    try {
      await habitService.deleteHabit(id)
      navigate('/habits')
    } catch (err) {
      setError(err.message || 'Failed to delete habit')
    }
  }
  
  if (isLoading) {
    return <LoadingState message="Loading habit..." fullPage />
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
            placeholder="Why is this habit important to you?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom Days</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Health">Health</option>
            <option value="Fitness">Fitness</option>
            <option value="Learning">Learning</option>
            <option value="Productivity">Productivity</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Time (optional)
          </label>
          <input
            name="reminderTime"
            type="time"
            value={formData.reminderTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            name="color"
            type="color"
            value={formData.color}
            onChange={handleChange}
            className="h-10 w-20 rounded cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label className="text-sm text-gray-700">
            Active (uncheck to pause this habit)
          </label>
        </div>
        
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

      {/* Recent Logs with Mood Analysis */}
      <div className="mt-6">
        <HabitLogs habitId={id} />
      </div>
    </div>
  )
}

