/**
 * MoodDistributionChart Component
 * Pie chart showing mood distribution using Recharts
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = {
  'Happy': '#10B981',
  'Stressed': '#EF4444',
  'Motivated': '#3B82F6',
  'Tired': '#6B7280',
  'Anxious': '#F59E0B',
  'Calm': '#8B5CF6',
  'Excited': '#EC4899',
  'Frustrated': '#DC2626',
  'Content': '#14B8A6',
  'Energetic': '#F97316',
  'Relaxed': '#06B6D4',
  'Overwhelmed': '#7C3AED',
  'Neutral': '#9CA3AF'
}

export default function MoodDistributionChart({ data = {} }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No mood distribution data available</p>
      </div>
    )
  }

  // Transform data for pie chart
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS['Neutral']} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}






