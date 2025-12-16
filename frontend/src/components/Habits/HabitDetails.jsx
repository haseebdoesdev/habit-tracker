/**
 * Habit Details Component
 * View detailed information about a specific habit
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import habitService from '../../services/habitService'
import logService from '../../services/logService'
import accountabilityService from '../../services/accountabilityService'
import { formatDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function HabitDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [habit, setHabit] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHabitData()
  }, [id])

  const fetchHabitData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const [habitData, statsData, logsData, commentsData] = await Promise.all([
        habitService.getHabit(id),
        habitService.getHabitStats(id),
        logService.getHabitLogs(id, null, null).catch(() => []), // Get all logs
        accountabilityService.getHabitComments(id).catch(() => []) // Try to get comments
      ])
      
      setHabit(habitData)
      setStats(statsData)
      setRecentLogs(logsData.slice(0, 30)) // Last 30 logs
      setComments(commentsData)
    } catch (err) {
      setError(err.message || 'Failed to load habit details')
      console.error('Failed to fetch habit data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    try {
      await habitService.completeHabit(id)
      fetchHabitData() // Refresh data
    } catch (err) {
      alert(err.message || 'Failed to complete habit')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this habit?')) {
      return
    }
    
    try {
      await habitService.deleteHabit(id)
      navigate('/habits')
    } catch (err) {
      alert(err.message || 'Failed to delete habit')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading habit details..." />
      </div>
    )
  }

  if (error || !habit) {
    return (
      <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">
        {error || 'Habit not found'}
        <Link to="/habits" className="ml-4 link">
          Back to Habits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-200">{habit.title}</h1>
          {habit.description && (
            <p className="text-gray-400 mt-2">{habit.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            to={`/habits/${id}/edit`}
            className="btn-secondary"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-terracotta-500/50 text-terracotta-400 rounded-organic hover:bg-terracotta-600/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {!habit.completed_today && (
        <div className="card">
          <button
            onClick={handleComplete}
            className="w-full btn-primary bg-solar-500 hover:bg-solar-600"
          >
            Complete Habit for Today
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-hover">
            <p className="text-sm text-gray-400 mb-2">Current Streak</p>
            <p className="text-3xl font-semibold text-gray-200">{habit.current_streak}</p>
          </div>
          <div className="card-hover">
            <p className="text-sm text-gray-400 mb-2">Longest Streak</p>
            <p className="text-3xl font-semibold text-gray-200">{habit.longest_streak}</p>
          </div>
          <div className="card-hover">
            <p className="text-sm text-gray-400 mb-2">Total Completions</p>
            <p className="text-3xl font-semibold text-gray-200">{stats.total_completions}</p>
          </div>
          <div className="card-hover">
            <p className="text-sm text-gray-400 mb-2">Completion Rate</p>
            <p className="text-3xl font-semibold text-accent-400">
              {stats.completion_rate.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Habit Information */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Details</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-400">Category</dt>
            <dd className="mt-1 text-sm text-gray-200 capitalize">{habit.category || 'Other'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-400">Frequency</dt>
            <dd className="mt-1 text-sm text-gray-200 capitalize">{habit.frequency || 'Daily'}</dd>
          </div>
          {habit.reminder_time && (
            <div>
              <dt className="text-sm font-medium text-gray-400">Reminder Time</dt>
              <dd className="mt-1 text-sm text-gray-200">{habit.reminder_time}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm font-medium text-gray-400">Status</dt>
            <dd className="mt-1">
              {habit.is_active ? (
                <span className="badge-success">
                  Active
                </span>
              ) : (
                <span className="badge">
                  Inactive
                </span>
              )}
            </dd>
          </div>
          {stats?.last_completed && (
            <div>
              <dt className="text-sm font-medium text-gray-400">Last Completed</dt>
              <dd className="mt-1 text-sm text-gray-200">
                {formatDate(stats.last_completed, 'long')}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Recent Logs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200">Recent Logs</h2>
          <Link
            to={`/habits/${id}/logs`}
            className="link text-sm"
          >
            View All
          </Link>
        </div>
        
        {recentLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No logs yet. Start tracking your habit!</p>
        ) : (
          <div className="space-y-3">
            {recentLogs.slice(0, 10).map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 border-b border-dark-400/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-200">
                      {formatDate(log.log_date, 'short')}
                    </span>
                    {log.completed ? (
                      <span className="badge-success">
                        Completed
                      </span>
                    ) : (
                      <span className="badge">
                        Missed
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-sm text-gray-400 mt-1">{log.notes}</p>
                  )}
                  {log.mood && (
                    <p className="text-xs text-gray-500 mt-1">Mood: {log.mood}/5</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section (if accountability partner) */}
      {comments.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-dark-400/50 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-200">{comment.author_username}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.created_at, 'short')}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}



