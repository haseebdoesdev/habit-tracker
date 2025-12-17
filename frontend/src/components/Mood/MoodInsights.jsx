/**
 * MoodInsights Component
 * Shows mood trends, distribution, and AI insights
 */

import { useState, useEffect } from 'react'
import moodService from '../../services/moodService'
import LoadingState from '../Common/LoadingState'
import MoodTrendChart from './MoodTrendChart'
import MoodDistributionChart from './MoodDistributionChart'
import MoodWeekView from './MoodWeekView'

export default function MoodInsights() {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const fetchInsights = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const data = await moodService.getMoodInsights(dateRange.start, dateRange.end)
      setInsights(data)
    } catch (err) {
      setError(err.message || 'Failed to load mood insights')
      console.error('Failed to fetch mood insights:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [dateRange])

  if (isLoading) {
    return <LoadingState message="Loading mood insights..." fullPage />
  }

  if (error) {
    return (
      <div className="card">
        <p className="text-terracotta-300">{error}</p>
      </div>
    )
  }

  if (!insights || (!insights.mood_trend || insights.mood_trend.length === 0)) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Mood Insights</h2>
        <div className="space-y-4 text-gray-400">
          <p className="font-medium">No mood data yet. Here's how to get started:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>Add notes (at least 10 characters) to your habit logs when completing them</li>
            <li>Click the <span className="font-semibold text-accent-400">"Analyze Mood"</span> button that appears on logs with notes</li>
            <li>Wait for AI to analyze your mood from the notes (this may take a few seconds)</li>
            <li>Come back here to see your mood trends and insights!</li>
          </ol>
          <div className="mt-4 p-4 bg-accent-600/20 rounded-soft border border-accent-500/50">
            <p className="text-sm text-accent-300 mb-2">
              <strong>Tip:</strong> You can add notes and analyze mood from:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-400 ml-4 space-y-1">
              <li>The "Today's Logs" page (sidebar → Today's Logs)</li>
              <li>Individual habit pages (click a habit → View Logs → Analyze Mood)</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-sunset-600/20 rounded-soft border border-sunset-500/50">
            <p className="text-sm text-sunset-300">
              <strong>Note:</strong> Just adding notes isn't enough - you need to click "Analyze Mood" for the AI to process your mood from the notes.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-200">Mood Insights</h2>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="input text-sm"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="input text-sm"
          />
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0]
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              setDateRange({ start: weekAgo, end: today })
            }}
            className="btn-secondary text-sm px-3 py-2"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0]
              const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              setDateRange({ start: monthAgo, end: today })
            }}
            className="btn-secondary text-sm px-3 py-2"
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* 7-Day Mood View (prioritized) */}
      {insights.mood_trend && insights.mood_trend.length > 0 && (
        <MoodWeekView moodTrend={insights.mood_trend} />
      )}

      {/* Mood Trend Chart */}
      <div className="card">
        <h3 className="text-md font-semibold text-gray-200 mb-4">Mood Trend Over Time</h3>
        <MoodTrendChart data={insights.mood_trend} />
      </div>

      {/* Mood Distribution and AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="card">
          <h3 className="text-md font-semibold text-gray-200 mb-4">Mood Distribution</h3>
          <MoodDistributionChart data={insights.mood_distribution} />
        </div>

        {/* AI Insights */}
        <div className="card">
          <h3 className="text-md font-semibold text-gray-200 mb-4">AI Insights</h3>
          <div className="bg-accent-600/20 rounded-soft p-4 border border-accent-500/50">
            <p className="text-gray-300 whitespace-pre-wrap">{insights.ai_insights}</p>
          </div>
        </div>
      </div>
    </div>
  )
}








