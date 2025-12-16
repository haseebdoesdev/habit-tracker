/**
 * MoodInsights Component
 * Shows mood trends, distribution, and AI insights
 */

import { useState, useEffect } from 'react'
import moodService from '../../services/moodService'
import LoadingState from '../Common/LoadingState'
import MoodTrendChart from './MoodTrendChart'
import MoodDistributionChart from './MoodDistributionChart'

export default function MoodInsights() {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true)
        setError('')
        
        // Get last 30 days of mood data
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        const data = await moodService.getMoodInsights(startDate, endDate)
        setInsights(data)
      } catch (err) {
        setError(err.message || 'Failed to load mood insights')
        console.error('Failed to fetch mood insights:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [])

  if (isLoading) {
    return <LoadingState message="Loading mood insights..." fullPage />
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!insights || (!insights.mood_trend || insights.mood_trend.length === 0)) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Mood Insights</h2>
        <p className="text-gray-500">
          Start adding notes to your habit logs and analyze them to see mood insights here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Mood Insights</h2>

      {/* Mood Trend Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-md font-semibold mb-4">Mood Trend Over Time</h3>
        <MoodTrendChart data={insights.mood_trend} />
      </div>

      {/* Mood Distribution and AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold mb-4">Mood Distribution</h3>
          <MoodDistributionChart data={insights.mood_distribution} />
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-md font-semibold mb-4">AI Insights</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{insights.ai_insights}</p>
          </div>
        </div>
      </div>
    </div>
  )
}






