/**
 * ProgressChart Component
 * Line chart showing progress over time using Recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressChart({ data = [], period = 'week' }) {
  // Format empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for this period</p>
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            {...getXAxisConfig()}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Completion Rate']}
          />
          <Line
            type="monotone"
            dataKey="completionRate"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
