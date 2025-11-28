/**
 * AnalyticsDashboard Component
 * ============================
 * [HASEEB] This is your component to implement.
 * 
 * Shows detailed analytics and statistics.
 */

import { useState, useEffect } from 'react'
// TODO: Import chart components from recharts
// TODO: Import HeatmapCalendar component
// TODO: Import ProgressChart component
// TODO: Import analytics service

export default function AnalyticsDashboard() {
  // TODO: Set up state for analytics data
  const [overview, setOverview] = useState(null)
  const [heatmapData, setHeatmapData] = useState([])
  const [chartData, setChartData] = useState([])
  const [categories, setCategories] = useState([])
  
  // TODO: Set up period selector state
  const [period, setPeriod] = useState('week')
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch all analytics data
    // WHY: Populate dashboard
    // APPROACH: Call multiple analytics endpoints
    
    // TODO: Get overview stats
    // analyticsService.getOverview()
    
    // TODO: Get heatmap data
    // analyticsService.getHeatmap(startDate, endDate)
    
    // TODO: Get chart data
    // analyticsService.getProgressChart(period)
    
    // TODO: Get category breakdown
    // analyticsService.getCategoryBreakdown()
  }, [period])
  
  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      
      {/* TODO: Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total habits */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total Habits</p>
          <p className="text-2xl font-bold">{overview?.totalHabits || 0}</p>
        </div>
        
        {/* Completion rate */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-green-600">
            {overview?.weeklyRate || 0}%
          </p>
        </div>
        
        {/* TODO: Add more stat cards */}
        {/* Total completions, Average streak, etc. */}
      </div>
      
      {/* Period selector */}
      <div className="flex space-x-2">
        {['week', 'month', 'year'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
      
      {/* TODO: Progress Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Progress Over Time</h2>
        {/* TODO: Add ProgressChart component */}
        {/* WHY: Visualize completion trends */}
        <div className="h-64 flex items-center justify-center text-gray-500">
          Add ProgressChart component here
        </div>
      </div>
      
      {/* TODO: Heatmap Calendar */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Heatmap</h2>
        {/* TODO: Add HeatmapCalendar component */}
        {/* WHY: GitHub-style activity visualization */}
        <div className="flex items-center justify-center text-gray-500">
          Add HeatmapCalendar component here
        </div>
      </div>
      
      {/* TODO: Category breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        {/* TODO: Display category stats */}
        {/* WHY: Compare performance across categories */}
        <div className="space-y-3">
          {/* TODO: Map through categories with progress bars */}
          <p className="text-gray-500">Category breakdown will appear here</p>
        </div>
      </div>
    </div>
  )
}

