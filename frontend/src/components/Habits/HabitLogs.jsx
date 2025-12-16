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
      'Happy': 'bg-green-100 text-green-800',
      'Stressed': 'bg-red-100 text-red-800',
      'Motivated': 'bg-blue-100 text-blue-800',
      'Tired': 'bg-gray-100 text-gray-800',
      'Anxious': 'bg-yellow-100 text-yellow-800',
      'Calm': 'bg-purple-100 text-purple-800',
      'Excited': 'bg-pink-100 text-pink-800',
      'Frustrated': 'bg-red-100 text-red-800',
      'Content': 'bg-teal-100 text-teal-800',
      'Energetic': 'bg-orange-100 text-orange-800',
      'Relaxed': 'bg-cyan-100 text-cyan-800',
      'Overwhelmed': 'bg-indigo-100 text-indigo-800',
      'Neutral': 'bg-gray-100 text-gray-800'
    }
    return colors[moodLabel] || colors['Neutral']
  }

  if (isLoading) {
    return <LoadingSpinner size="sm" message="Loading logs..." />
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-md font-semibold mb-4">Recent Logs</h3>
        <p className="text-gray-500">No logs yet. Complete your habit to create log entries.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-md font-semibold mb-4">Recent Logs</h3>
      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(log.log_date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                {log.completed && (
                  <span className="text-xs text-green-600">✓ Completed</span>
                )}
              </div>
              {log.mood_label && (
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getMoodColor(log.mood_label)}`}>
                    {log.mood_label}
                  </span>
                  {log.mood_intensity && (
                    <span className="text-xs text-gray-500">
                      {Math.round(log.mood_intensity * 100)}%
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {log.notes && (
              <p className="text-sm text-gray-600 mb-2">{log.notes}</p>
            )}
            
            {log.notes && log.notes.length >= 10 && !log.mood_label && (
              <button
                onClick={() => handleAnalyzeMood(log.id)}
                disabled={analyzingId === log.id}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
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






