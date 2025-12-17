/**
 * Habit Logs History Component
 * View historical logs for a specific habit
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import habitService from '../../services/habitService'
import logService from '../../services/logService'
import moodService from '../../services/moodService'
import { formatDate, toAPIDate, fromAPIDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function HabitLogsHistory() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [habit, setHabit] = useState(null)
  const [logs, setLogs] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [analyzingId, setAnalyzingId] = useState(null)

  useEffect(() => {
    fetchHabitAndLogs()
  }, [id, startDate, endDate])

  const fetchHabitAndLogs = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const [habitData, logsData] = await Promise.all([
        habitService.getHabit(id),
        logService.getHabitLogs(
          id,
          startDate || null,
          endDate || null
        )
      ])
      
      setHabit(habitData)
      setLogs(logsData)
    } catch (err) {
      setError(err.message || 'Failed to load habit logs')
      console.error('Failed to fetch habit logs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyzeMood = async (logId) => {
    try {
      setAnalyzingId(logId)
      await moodService.analyzeLogMood(logId)
      fetchHabitAndLogs() // Refresh to get updated mood analysis
    } catch (err) {
      alert(err.message || 'Failed to analyze mood')
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleDeleteLog = async (logId) => {
    if (!confirm('Are you sure you want to delete this log entry?')) {
      return
    }
    
    try {
      await logService.deleteLog(logId)
      fetchHabitAndLogs() // Refresh
    } catch (err) {
      alert(err.message || 'Failed to delete log')
    }
  }

  const handleApplyFilter = (e) => {
    e.preventDefault()
    fetchHabitAndLogs()
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading habit logs..." />
      </div>
    )
  }

  if (error || !habit) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error || 'Habit not found'}
        <Link to="/habits" className="ml-4 text-blue-600 hover:underline">
          Back to Habits
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/habits/${id}`}
            className="text-blue-600 hover:underline text-sm mb-2 inline-block"
          >
            ← Back to Habit Details
          </Link>
          <h1 className="text-2xl font-semibold text-gray-200">Logs: {habit.title}</h1>
        </div>
      </div>

      {/* Filter Form */}
      <div className="card">
        <form onSubmit={handleApplyFilter} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            className="btn-primary text-sm px-4 py-2"
          >
            Filter
          </button>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="btn-secondary text-sm px-4 py-2"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Statistics Summary */}
      {logs.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">Total Logs</p>
              <p className="text-2xl font-semibold text-gray-200">{logs.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Completed</p>
              <p className="text-2xl font-semibold text-solar-400">
                {logs.filter(log => log.completed).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">Completion Rate</p>
              <p className="text-2xl font-semibold text-accent-400">
                {logs.length > 0
                  ? ((logs.filter(log => log.completed).length / logs.length) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logs List */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Log Entries</h2>
        
        {logs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No logs found for this date range.</p>
            <Link
              to={`/logs/daily/${toAPIDate(new Date())}`}
              className="link mt-4 inline-block"
            >
              Log a completion
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="border-b border-dark-400/50 pb-4 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-medium text-gray-200">
                        {formatDate(log.log_date, 'long')}
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
                      {log.mood && (
                        <span className="badge bg-accent-600/30 text-accent-300 border border-accent-500/50">
                          Mood: {log.mood}/5
                        </span>
                      )}
                      {log.mood_label && (
                        <span className="badge bg-sky-600/30 text-sky-300 border border-sky-500/50">
                          {log.mood_label}
                        </span>
                      )}
                    </div>
                    
                    {log.notes && (
                      <p className="text-gray-300 mb-2">{log.notes}</p>
                    )}
                    
                    <div className="flex gap-4 text-sm text-gray-400 flex-wrap">
                      {log.duration_minutes && (
                        <span>Duration: {log.duration_minutes} minutes</span>
                      )}
                      {log.completion_time && (
                        <span>
                          Completed at: {new Date(log.completion_time).toLocaleTimeString()}
                        </span>
                      )}
                      {log.mood_analyzed_at && (
                        <span>
                          Mood analyzed: {formatDate(log.mood_analyzed_at, 'short')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {log.notes && log.notes.length >= 10 && !log.mood_label && (
                      <button
                        onClick={() => handleAnalyzeMood(log.id)}
                        disabled={analyzingId === log.id}
                        className="px-3 py-1 text-sm bg-accent-600/30 text-accent-300 rounded-soft hover:bg-accent-600/40 transition-colors disabled:opacity-50 border border-accent-500/50"
                      >
                        {analyzingId === log.id ? 'Analyzing...' : 'Analyze Mood'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="px-3 py-1 text-sm border border-terracotta-500/50 text-terracotta-400 rounded-organic hover:bg-terracotta-600/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



