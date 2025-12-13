/**
 * AnalyticsDashboard Component
 * Shows detailed analytics and statistics
 */

import { useState, useEffect } from 'react'
import api from '../../services/api'
import HeatmapCalendar from './HeatmapCalendar'
import ProgressChart from './ProgressChart'

export default function AnalyticsDashboard() {
  const [overview, setOverview] = useState(null)
  const [heatmapData, setHeatmapData] = useState([])
  const [chartData, setChartData] = useState([])
  const [categories, setCategories] = useState([])
  const [period, setPeriod] = useState('week')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)

        // Get overview stats
        const overviewRes = await api.get('/analytics/overview')
        setOverview(overviewRes.data)

        // Get heatmap data (last 365 days)
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const heatmapRes = await api.get('/analytics/heatmap', {
          params: { start_date: startDate, end_date: endDate }
        })
        // Transform heatmap data to array format for component
        const heatmapArray = Object.entries(heatmapRes.data.data || {}).map(([date, count]) => ({
          date,
          count
        }))
        setHeatmapData(heatmapArray)

        // Get chart data
        const chartRes = await api.get('/analytics/progress', {
          params: { period }
        })
        // Transform chart data for ProgressChart component
        const chartArray = Object.entries(chartRes.data.data || {}).map(([date, count]) => {
          const d = new Date(date)
          const label = period === 'week'
            ? d.toLocaleDateString('en-US', { weekday: 'short' })
            : period === 'month'
              ? d.getDate().toString()
              : d.toLocaleDateString('en-US', { month: 'short' })
          return { label, completionRate: count }
        })
        setChartData(chartArray)

        // Get category breakdown
        const categoryRes = await api.get('/analytics/categories')
        const categoryArray = Object.entries(categoryRes.data || {}).map(([name, stats]) => ({
          name,
          ...stats
        }))
        setCategories(categoryArray)

      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Habits</p>
          <p className="text-2xl font-bold">{overview?.total_habits || overview?.totalHabits || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-green-600">
            {Math.round((overview?.this_week_completion_rate || overview?.weeklyRate || 0) * 100)}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Completions</p>
          <p className="text-2xl font-bold text-blue-600">
            {overview?.total_completions || overview?.totalCompletions || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Active Streaks</p>
          <p className="text-2xl font-bold text-orange-600">
            {overview?.current_active_streaks || overview?.activeStreaks || 0}
          </p>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex space-x-2">
        {['week', 'month', 'year'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg ${period === p
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
        <ProgressChart data={chartData} period={period} />
      </div>

      {/* Heatmap Calendar */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Heatmap</h2>
        <HeatmapCalendar data={heatmapData} />
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{category.name}</span>
                  <span className="text-gray-500">
                    {category.total_habits || category.totalHabits || 0} habits
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((category.completion_rate || category.completionRate || 0) * 10, 100)}%`
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No category data available</p>
          )}
        </div>
      </div>
    </div>
  )
}
