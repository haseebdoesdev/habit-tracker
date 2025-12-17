/**
 * MoodTrendChart Component
 * Line chart showing mood intensity over time using Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MoodTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-dark-300/50 rounded-soft">
        <p className="text-gray-400">No mood data available</p>
      </div>
    )
  }

  // Transform data for chart
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    intensity: Math.round(item.mood_intensity * 100),
    mood: item.mood_label,
    sentiment: item.sentiment
  }))

  // Color based on sentiment
  const getLineColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '#10B981' // green
      case 'negative':
        return '#EF4444' // red
      default:
        return '#6B7280' // gray
    }
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value, name, props) => [
              `${value}% (${props.payload.mood})`,
              'Mood Intensity'
            ]}
          />
          <Line
            type="monotone"
            dataKey="intensity"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}










