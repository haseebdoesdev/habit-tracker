/**
 * ProgressChart Component
 * Line chart showing progress over time using Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressChart({ data = [], period = 'week' }) {
  // Format empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-dark-300/50 rounded-soft">
        <p className="text-gray-400">No data available for this period</p>
      </div>
    )
  }

  // Configure X-axis based on period
  const getXAxisConfig = () => {
    switch (period) {
      case 'week':
        return { interval: 0 }
      case 'month':
        return { interval: 'preserveStartEnd' }
      case 'year':
        return { interval: 'preserveStartEnd' }
      default:
        return { interval: 0 }
    }
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            {...getXAxisConfig()}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Completion Rate']}
            contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Line
            type="monotone"
            dataKey="completionRate"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
