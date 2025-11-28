/**
 * HabitList Component
 * ===================
 * [OMAMAH] This is your component to implement.
 * 
 * Displays all user's habits with filtering options.
 */

import { useState, useEffect } from 'react'
// TODO: Import Link from react-router-dom
// TODO: Import habitService

export default function HabitList() {
  // TODO: Set up state for habits
  const [habits, setHabits] = useState([])
  
  // TODO: Set up filter state
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'active'
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // TODO: Fetch habits based on filters
    // WHY: Load habit data
    // APPROACH: habitService.getHabits(filter)
    
    // TODO: Update habits state
    // WHY: Display fetched habits
    
    // TODO: Handle errors
    // WHY: Show error state
  }, [filter])
  
  const handleFilterChange = (key, value) => {
    // TODO: Update filter state
    // WHY: Trigger refetch with new filters
    // APPROACH: setFilter({ ...filter, [key]: value })
  }
  
  // TODO: Define category options for filter
  const categories = ['all', 'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness']
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Habits</h1>
        {/* TODO: Add Link to create new habit */}
        <a
          href="/habits/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Habit
        </a>
      </div>
      
      {/* TODO: Filter controls */}
      <div className="bg-white rounded-xl shadow p-4 flex space-x-4">
        {/* Category filter */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {/* TODO: Map category options */}
            <option value="all">All Categories</option>
          </select>
        </div>
        
        {/* Status filter */}
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
      
      {/* TODO: Display loading state */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading habits...</div>
      )}
      
      {/* TODO: Display error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}
      
      {/* Habits grid/list */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No habits found. Create your first habit!
            </div>
          ) : (
            /* TODO: Map through habits */
            /* WHY: Display each habit as a card */
            /* APPROACH:
            habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-xl shadow p-4">
                <h3 className="font-semibold">{habit.title}</h3>
                <p className="text-gray-500 text-sm">{habit.category}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-orange-500 font-bold">{habit.currentStreak} day streak</span>
                  <Link to={`/habits/${habit.id}/edit`} className="text-blue-600">Edit</Link>
                </div>
              </div>
            ))
            */
            <div className="col-span-full text-center py-8 text-gray-500">
              Render habit cards here
            </div>
          )}
        </div>
      )}
    </div>
  )
}

