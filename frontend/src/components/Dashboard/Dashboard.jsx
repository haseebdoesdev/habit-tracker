/**
 * Dashboard Component
 * ===================
 * Main dashboard view showing habit overview and quick actions.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HabitCard from './HabitCard'
import StreakDisplay from './StreakDisplay'
import LoadingState from '../Common/LoadingState'
import habitService from '../../services/habitService'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  
  const [habits, setHabits] = useState([])
  const [stats, setStats] = useState(null)
  const [motivation, setMotivation] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // 1. Fetch user's habits
        const habitsData = await habitService.getHabits({ is_active: true })
        setHabits(habitsData)
        
        // 2. Fetch overview stats
        const statsRes = await api.get('/analytics/overview')
        setStats(statsRes.data)
        
        // 3. Fetch AI motivation
        const motivationRes = await api.get('/ai/motivation')
        setMotivation(motivationRes.data.message)
        
      } catch (err) {
        console.error('Dashboard load error:', err)
        setError('Failed to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  // Helper to determine if a habit is scheduled for today
  const isScheduledForToday = (habit) => {
    if (!habit) return false
    if (habit.frequency?.toLowerCase() === 'daily') return true
    if (habit.frequency?.toLowerCase() === 'weekly' || habit.frequency?.toLowerCase() === 'custom') {
      if (!habit.target_days) return false // No days set
      
      const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
      return habit.target_days.toUpperCase().includes(todayName.substring(0, 2))
    }
    
    return true // Default fallback
  }
  
  const todaysHabits = habits.filter(isScheduledForToday)
  
  const handleCompleteHabit = async (habitId) => {
    try {
      setHabits(prev => prev.map(h => {
        if (h.id === habitId) {
          return { ...h, completed_today: true, current_streak: h.current_streak + 1 }
        }
        return h
      }))
      
      // Call API
      const response = await habitService.completeHabit(habitId)
      
      // Update with actual server response data to ensure accuracy
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
      
      // Refresh stats lightly
      setStats(prev => ({
        ...prev,
        total_completions: (prev?.total_completions || 0) + 1
      }))
      
    } catch (err) {
      console.error("Failed to complete habit:", err)
      alert("Failed to mark habit as complete. Please try again.")
    }
  }
  
  if (isLoading) {
    return <LoadingState message="Loading dashboard..." fullPage />
  }
  
  const streakData = {
    longestStreak: stats?.longest_active_streaks || 0,
    activeCount: stats?.current_active_streaks || 0,
    habits: habits 
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.username}</p>
        </div>
        <Link 
          to="/habits/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Habit
        </Link>
      </div>
      
      {/* AI Motivation Message */}
      {motivation && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start space-x-4">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="font-semibold text-lg opacity-90">Daily Motivation</h3>
              <p className="mt-1 font-medium text-lg leading-relaxed">
                "{motivation}"
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Habits</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.total_active_habits || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Completions</p>
          <p className="text-2xl font-bold text-blue-600">{stats?.total_completions || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round((stats?.today_completion_rate || 0) * 100)}%
          </p>
          <p className="text-xs text-gray-400">Today</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Current Streaks</p>
          <p className="text-2xl font-bold text-orange-500">{stats?.current_active_streaks || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {todaysHabits.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No habits scheduled for today.</p>
                <Link to="/habits/new" className="text-blue-600 font-medium hover:underline">
                  Create a new habit
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {todaysHabits.map(habit => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    isCompletedToday={habit.completed_today}
                    onComplete={() => handleCompleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <StreakDisplay streaks={streakData} />
          
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">View Analytics</h3>
            <p className="text-sm text-blue-700 mb-3">Check your weekly progress and detailed stats.</p>
            <Link 
              to="/analytics" 
              className="block w-full py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Go to Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}