/**
 * HabitLogs Component
 * Shows recent logs for a habit with ability to analyze mood
 */

import { useState, useEffect } from 'react'
import api from '../../services/api'
import moodService from '../../services/moodService'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function HabitLogs({ habitId }) {
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [analyzingId, setAnalyzingId] = useState(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/logs/habit/${habitId}`, {
          params: { limit: 10 }
        })
        setLogs(response.data)
      } catch (error) {
        console.error('Failed to fetch logs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (habitId) {
      fetchLogs()
    }
  }, [habitId])

  const handleAnalyzeMood = async (logId) => {
    try {
      setAnalyzingId(logId)
      const result = await moodService.analyzeLogMood(logId)
      
      // Update the log in the list
      setLogs(logs.map(log => 
        log.id === logId 
          ? { ...log, mood_label: result.mood_label, mood_intensity: result.mood_intensity, mood_analyzed_at: new Date().toISOString() }
          : log
      ))
    } catch (error) {
      alert(error.message || 'Failed to analyze mood')
    } finally {
      setAnalyzingId(null)
    }
  }

  const getMoodColor = (moodLabel) => {
    const colors = {
      'Happy': 'bg-solar-600/30 text-solar-300 border border-solar-500/50',
      'Stressed': 'bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50',
      'Motivated': 'bg-accent-600/30 text-accent-300 border border-accent-500/50',
      'Tired': 'badge',
      'Anxious': 'bg-sunset-600/30 text-sunset-300 border border-sunset-500/50',
      'Calm': 'bg-sky-600/30 text-sky-300 border border-sky-500/50',
      'Excited': 'bg-sunset-600/30 text-sunset-300 border border-sunset-500/50',
      'Frustrated': 'bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50',
      'Content': 'bg-solar-600/30 text-solar-300 border border-solar-500/50',
      'Energetic': 'bg-sunset-600/30 text-sunset-300 border border-sunset-500/50',
      'Relaxed': 'bg-sky-600/30 text-sky-300 border border-sky-500/50',
      'Overwhelmed': 'bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50',
      'Neutral': 'badge'
    }
    return colors[moodLabel] || colors['Neutral']
  }

  if (isLoading) {
    return <LoadingSpinner size="sm" message="Loading logs..." />
  }

  if (logs.length === 0) {
    return (
      <div className="card">
        <h3 className="text-md font-semibold text-gray-200 mb-4">Recent Logs</h3>
        <p className="text-gray-400">No logs yet. Complete your habit to create log entries.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-md font-semibold text-gray-200 mb-4">Recent Logs</h3>
      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="border border-dark-400/50 rounded-soft p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-200">
                  {new Date(log.log_date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                {log.completed && (
                  <span className="text-xs text-solar-400">✓ Completed</span>
                )}
              </div>
              {log.mood_label && (
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getMoodColor(log.mood_label)}`}>
                    {log.mood_label}
                  </span>
                  {log.mood_intensity && (
                    <span className="text-xs text-gray-400">
                      {Math.round(log.mood_intensity * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {log.notes && (
              <p className="text-sm text-gray-300 mb-2">{log.notes}</p>
            )}
            
            {log.notes && log.notes.length >= 10 && !log.mood_label && (
              <button
                onClick={() => handleAnalyzeMood(log.id)}
                disabled={analyzingId === log.id}
                className="text-xs text-accent-400 hover:text-accent-300 disabled:opacity-50 transition-colors"
              >
                {analyzingId === log.id ? (
                  <span className="flex items-center space-x-1">
                    <LoadingSpinner size="sm" />
                    <span>Analyzing...</span>
                  </span>
                ) : (
                  'Analyze Mood with AI'
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}









