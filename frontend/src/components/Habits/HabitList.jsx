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
import { FireIcon } from '../Common/Icons'

export default function HabitList() {
  const [habits, setHabits] = useState([])
  const [completingId, setCompletingId] = useState(null)
  
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

  const handleCompleteHabit = async (habitId) => {
    try {
      setCompletingId(habitId)
      const response = await habitService.completeHabit(habitId)
      
      // Update the habit in the list
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            completed_today: true,
            current_streak: response.current_streak,
            longest_streak: response.longest_streak
          }
        }
        return h
      }))
    } catch (err) {
      alert(err.message || 'Failed to complete habit')
    } finally {
      setCompletingId(null)
    }
  }
  
  const categories = ['all', 'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness']
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-200">My Habits</h1>
        <Link
          to="/habits/new"
          className="btn-primary"
        >
          + New Habit
        </Link>
      </div>
      
      <div className="card flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Category</label>
          <select
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-2">Status</label>
          <select
            value={filter.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input"
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
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">{error}</div>
      )}
      
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.length === 0 ? (
            <div className="col-span-full empty-state">
              <p className="empty-state-text">No habits found. Create your first habit!</p>
              <Link to="/habits/new" className="link mt-4 inline-block">Create Habit</Link>
            </div>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className={`card transition-all ${
                habit.completed_today ? 'bg-solar-600/20 border-solar-500/50' : ''
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompleteHabit(habit.id)}
                        disabled={completingId === habit.id || habit.completed_today}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                          habit.completed_today
                            ? 'bg-solar-500 border-solar-500 text-white cursor-default'
                            : 'border-dark-500 hover:border-solar-400 hover:bg-solar-600/20 cursor-pointer'
                        } ${completingId === habit.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={habit.completed_today ? 'Completed today' : 'Mark as complete'}
                      >
                        {habit.completed_today && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <Link 
                        to={`/habits/${habit.id}`}
                        className={`font-semibold hover:underline ${
                          habit.completed_today ? 'text-gray-500 line-through' : 'text-gray-200 hover:text-accent-400'
                        }`}
                      >
                        {habit.title}
                      </Link>
                    </div>
                    <p className="text-gray-400 text-sm mt-1 ml-8">{habit.category || 'Uncategorized'}</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 border border-dark-400"
                    style={{ backgroundColor: habit.color || '#0073e6' }}
                  />
                </div>
                <div className="mt-3 flex justify-between items-center ml-8">
                  <div className="flex items-center gap-4">
                    <span className="text-sunset-400 font-bold flex items-center gap-1">
                      <FireIcon className="w-4 h-4" />
                      <span>{habit.current_streak || habit.currentStreak || 0}</span>
                      <span className="text-xs text-gray-500 font-normal">day streak</span>
                    </span>
                    {habit.completed_today && (
                      <span className="text-xs text-solar-400 font-medium">✓ Done today</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/logs/daily/${new Date().toISOString().split('T')[0]}`}
                      className="text-sm text-accent-400 hover:text-accent-300 hover:underline"
                      title="Add detailed log"
                    >
                      Log
                    </Link>
                    <Link to={`/habits/${habit.id}`} className="text-sm text-accent-400 hover:text-accent-300 hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

