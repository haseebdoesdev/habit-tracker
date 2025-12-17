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
import { SparklesIcon, SeedlingIcon } from '../Common/Icons'

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-martian mb-2">Dashboard</h1>
          <p className="text-gray-400 font-medium">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/logs/daily/${new Date().toISOString().split('T')[0]}`}
            className="btn-secondary"
          >
            Today's Logs
          </Link>
          <Link 
            to="/habits/new" 
            className="btn-primary"
          >
            + New Habit
          </Link>
        </div>
      </div>
      
      {/* AI Motivation Message */}
      {motivation && (
        <div className="card-elevated bg-gradient-to-br from-accent-500/90 to-accent-600/90 text-white glow-accent animate-slide-up">
          <div className="flex items-start space-x-4">
            <SparklesIcon className="w-6 h-6 animate-gentle-pulse flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-xl opacity-95 mb-2">Daily Motivation</h3>
              <p className="font-medium text-lg leading-relaxed opacity-90">
                "{motivation}"
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="card-hover">
          <p className="text-sm text-gray-400 font-medium mb-2">Active Habits</p>
          <p className="text-3xl font-bold text-gray-200">{stats?.total_active_habits || 0}</p>
        </div>
        <div className="card-hover">
          <p className="text-sm text-gray-400 font-medium mb-2">Total Completions</p>
          <p className="text-3xl font-bold text-accent-400">{stats?.total_completions || 0}</p>
        </div>
        <div className="card-hover">
          <p className="text-sm text-gray-400 font-medium mb-2">Completion Rate</p>
          <p className="text-3xl font-bold text-solar-400">
            {Math.round((stats?.today_completion_rate || 0) * 100)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Today</p>
        </div>
        <div className="card-hover">
          <p className="text-sm text-gray-400 font-medium mb-2">Current Streaks</p>
          <p className="text-3xl font-bold text-sunset-400">{stats?.current_active_streaks || 0}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits List */}
        <div className="lg:col-span-2 space-y-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-gray-200">Today's Schedule</h2>
          
          <div className="card overflow-hidden">
            {todaysHabits.length === 0 ? (
              <div className="empty-state">
                <SeedlingIcon className="empty-state-icon text-gray-600" />
                <p className="empty-state-text">No habits scheduled for today.</p>
                <Link to="/habits/new" className="link mt-4 inline-block">
                  Create a new habit
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-dark-400/50">
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
        
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <StreakDisplay streaks={streakData} />
          
          <div className="card bg-dark-300/50 border-dark-500/50">
            <h3 className="font-semibold text-gray-200 mb-2 text-lg">View Analytics</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Check your weekly progress and detailed stats.</p>
            <Link 
              to="/analytics" 
              className="btn-primary w-full text-center"
            >
              Go to Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}