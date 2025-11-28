/**
 * Dashboard Component
 * ===================
 * [NOUMAN] This is your component to implement.
 * 
 * Main dashboard view showing habit overview and quick actions.
 */

import { useState, useEffect } from 'react'
// TODO: Import HabitCard component
// TODO: Import StreakDisplay component
// TODO: Import habitService for API calls
// TODO: Import useAuth to get current user

export default function Dashboard() {
  // TODO: Set up state for habits
  // WHY: Store fetched habits
  const [habits, setHabits] = useState([])
  
  // TODO: Set up state for stats
  // WHY: Overview statistics
  const [stats, setStats] = useState(null)
  
  // TODO: Set up loading and error states
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // TODO: Fetch user's habits on mount
    // WHY: Load data when dashboard opens
    // APPROACH: Call habitService.getHabits()
    
    // TODO: Fetch overview stats
    // WHY: Show completion rates, streaks, etc.
    // APPROACH: Call analyticsService.getOverview()
    
    // TODO: Handle loading and errors
    // WHY: Provide feedback to user
  }, [])
  
  const handleCompleteHabit = async (habitId) => {
    // TODO: Mark habit as complete for today
    // WHY: Quick completion from dashboard
    // APPROACH: Call habitService.completeHabit(habitId)
    
    // TODO: Update local state optimistically
    // WHY: Immediate UI feedback
    // APPROACH: Update habits state to show completed
    
    // TODO: Handle errors and rollback if needed
    // WHY: Sync with server state
  }
  
  // TODO: Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your dashboard...</div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {/* TODO: Add quick action buttons */}
        {/* WHY: Easy access to common actions */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + New Habit
        </button>
      </div>
      
      {/* TODO: Stats Overview Cards */}
      {/* WHY: Quick view of overall progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TODO: Create stat cards for:
            - Today's completion rate
            - Active streaks count
            - Total completions this week
            - Current longest streak
        */}
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Today's Progress</p>
          <p className="text-2xl font-bold">0/0</p>
        </div>
        {/* TODO: Add more stat cards */}
      </div>
      
      {/* TODO: Add StreakDisplay component */}
      {/* WHY: Show streaks prominently for motivation */}
      
      {/* Today's Habits */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Today's Habits</h2>
        
        {/* TODO: Map through habits and render HabitCard for each */}
        {/* WHY: Show each habit with completion toggle */}
        {habits.length === 0 ? (
          <p className="text-gray-500">
            No habits yet. Create your first habit to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {/* TODO: habits.map(habit => <HabitCard ... />) */}
            <p className="text-gray-500">Render habit cards here</p>
          </div>
        )}
      </div>
      
      {/* TODO: AI Motivation Message */}
      {/* WHY: Personalized encouragement */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
        <h3 className="font-semibold">AI Motivation</h3>
        <p className="mt-2 opacity-90">
          {/* TODO: Fetch and display AI motivation message */}
          "Keep up the great work! You're building awesome habits."
        </p>
      </div>
    </div>
  )
}

