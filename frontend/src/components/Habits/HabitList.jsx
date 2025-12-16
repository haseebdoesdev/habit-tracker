/**
 * HabitList Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Displays all user's habits with filtering options.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingState from '../Common/LoadingState'
import habitService from '../../services/habitService'

export default function HabitList() {
  const [habits, setHabits] = useState([])
  
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'active'
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setIsLoading(true)
        const params = {}
        if (filter.category !== 'all') {
          params.category = filter.category
        }
        if (filter.status !== 'all') {
          params.is_active = filter.status === 'active'
        }
        const data = await habitService.getHabits(params)
        setHabits(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load habits')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchHabits()
  }, [filter])
  
  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value })
  }
  
  const categories = ['all', 'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness']
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
        <Link
          to="/habits/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Habit
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow p-4 flex space-x-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      
      {isLoading && (
        <LoadingState message="Loading habits..." />
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}
      
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No habits found. Create your first habit!
            </div>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{habit.title}</h3>
                    <p className="text-gray-500 text-sm">{habit.category || 'Uncategorized'}</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color || '#3B82F6' }}
                  />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-orange-500 font-bold">
                    {habit.current_streak || habit.currentStreak || 0} day streak
                  </span>
                  <Link to={`/habits/${habit.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

