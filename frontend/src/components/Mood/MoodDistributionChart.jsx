/**
 * MoodDistributionChart Component
 * Pie chart showing mood distribution using Recharts with gradients
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Base colors with gradient definitions (from light to dark)
const MOOD_GRADIENTS = {
  'Happy': { from: '#34D399', to: '#10B981' },
  'Stressed': { from: '#FCA5A5', to: '#EF4444' },
  'Motivated': { from: '#60A5FA', to: '#3B82F6' },
  'Tired': { from: '#9CA3AF', to: '#6B7280' },
  'Anxious': { from: '#FBBF24', to: '#F59E0B' },
  'Calm': { from: '#A78BFA', to: '#8B5CF6' },
  'Excited': { from: '#F472B6', to: '#EC4899' },
  'Frustrated': { from: '#F87171', to: '#DC2626' },
  'Content': { from: '#5EEAD4', to: '#14B8A6' },
  'Energetic': { from: '#FB923C', to: '#F97316' },
  'Relaxed': { from: '#22D3EE', to: '#06B6D4' },
  'Overwhelmed': { from: '#A78BFA', to: '#7C3AED' },
  'Neutral': { from: '#D1D5DB', to: '#9CA3AF' }
}

const getGradientId = (mood) => `gradient-${mood.replace(/\s+/g, '-').toLowerCase()}`

export default function MoodDistributionChart({ data = {} }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-dark-300/50 rounded-soft">
        <p className="text-gray-400">No mood distribution data available</p>
      </div>
    )
  }

  // Transform data for pie chart and calculate percentages
  const total = Object.values(data).reduce((sum, val) => sum + val, 0)
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      value,
      percent: total > 0 ? (value / total) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value) // Sort by value descending

  // Generate unique IDs for gradients
  const gradientIds = chartData.map(entry => ({
    name: entry.name,
    id: getGradientId(entry.name),
    gradient: MOOD_GRADIENTS[entry.name] || MOOD_GRADIENTS['Neutral']
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Define SVG gradients */}
          <defs>
            {gradientIds.map(({ id, gradient }) => (
              <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={gradient.from} stopOpacity={1} />
                <stop offset="100%" stopColor={gradient.to} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              // Only show label if slice is large enough (> 5%)
              if (percent < 5) return ''
              return `${name} ${percent.toFixed(0)}%`
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => {
              const gradientId = getGradientId(entry.name)
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${gradientId})`}
                  stroke="#1a1a1a"
                  strokeWidth={2}
                />
              )
            })}
          </Pie>
          <Tooltip 
            formatter={(value, name, props) => {
              const percent = props.payload.percent
              return [`${value.toFixed(2)} (${percent.toFixed(1)}%)`, name]
            }}
            contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #4a4a4a', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
            formatter={(value) => {
              const entry = chartData.find(d => d.name === value)
              return entry ? `${value} (${entry.percent.toFixed(1)}%)` : value
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}


