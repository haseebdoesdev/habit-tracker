/**
 * MoodWeekView Component
 * Displays mood visualization for the past 7 days with color coding
 * Recent days have more visual weight
 */

export default function MoodWeekView({ moodTrend = [] }) {
  // Get last 7 days
  const today = new Date()
  const days = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Find mood data for this date
    const dayMood = moodTrend.find(m => m.date === dateStr)
    
    days.push({
      date: dateStr,
      dateObj: date,
      mood: dayMood,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
    })
  }

  // Get all unique moods for color mapping
  const getMoodColor = (moodLabel, intensity) => {
    if (!moodLabel || intensity === null || intensity === undefined) {
      return { bg: '#E5E7EB', text: '#6B7280', label: 'No data', opacity: 0.3 }
    }
    
    const normalizedIntensity = Math.max(0, Math.min(1, intensity))
    
    // Color map for different moods
    const moodColors = {
      'Happy': { base: '#10B981', name: 'Happy' },
      'Content': { base: '#34D399', name: 'Content' },
      'Calm': { base: '#60A5FA', name: 'Calm' },
      'Relaxed': { base: '#818CF8', name: 'Relaxed' },
      'Motivated': { base: '#F59E0B', name: 'Motivated' },
      'Excited': { base: '#EF4444', name: 'Excited' },
      'Energetic': { base: '#F97316', name: 'Energetic' },
      'Stressed': { base: '#DC2626', name: 'Stressed' },
      'Anxious': { base: '#BE185D', name: 'Anxious' },
      'Frustrated': { base: '#991B1B', name: 'Frustrated' },
      'Tired': { base: '#6B7280', name: 'Tired' },
      'Overwhelmed': { base: '#7C2D12', name: 'Overwhelmed' },
      'Neutral': { base: '#9CA3AF', name: 'Neutral' }
    }
    
    const colorInfo = moodColors[moodLabel] || moodColors['Neutral']
    
    // Use opacity for intensity - more intense = more opaque
    const opacity = 0.5 + (normalizedIntensity * 0.5) // 0.5 to 1.0
    
    return {
      bg: colorInfo.base,
      text: '#FFFFFF',
      label: colorInfo.name,
      intensity: normalizedIntensity,
      opacity: opacity
    }
  }

  // Calculate average mood for the week
  const moodsWithData = days.filter(d => d.mood && d.mood.mood_intensity !== null)
  const avgIntensity = moodsWithData.length > 0
    ? moodsWithData.reduce((sum, d) => sum + d.mood.mood_intensity, 0) / moodsWithData.length
    : null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-200">Mood Over Past 7 Days</h3>
        {avgIntensity !== null && (
          <span className="text-sm text-gray-400">
            Avg: {(avgIntensity * 100).toFixed(0)}% intensity
          </span>
        )}
      </div>
      
      <div className="flex items-end justify-between gap-2">
        {days.map((day, index) => {
          const isToday = index === days.length - 1
          const isRecent = index >= days.length - 3 // Last 3 days get more weight
          
          const colorInfo = getMoodColor(
            day.mood?.mood_label,
            day.mood?.mood_intensity
          )
          
          // Height based on intensity, with more weight for recent days
          const baseHeight = day.mood ? (day.mood.mood_intensity * 120) : 20
          const weightMultiplier = isToday ? 1.2 : (isRecent ? 1.1 : 1.0)
          const height = baseHeight * weightMultiplier
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div className="relative w-full flex flex-col items-center">
                {/* Mood bar with intensity-based opacity */}
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:opacity-90"
                  style={{
                    backgroundColor: colorInfo.bg,
                    height: `${Math.max(20, height)}px`,
                    opacity: day.mood ? colorInfo.opacity : 0.3,
                    minHeight: '20px'
                  }}
                  title={
                    day.mood
                      ? `${day.mood.mood_label} (${(day.mood.mood_intensity * 100).toFixed(0)}% intensity)`
                      : 'No mood data'
                  }
                />
                
                {/* Day label */}
                <div className={`mt-2 text-xs font-medium ${
                  isToday ? 'text-accent-400 font-bold' : 'text-gray-400'
                }`}>
                  {day.dayName}
                </div>
                
                {/* Date */}
                <div className="text-xs text-gray-500 mt-0.5">
                  {day.dateObj.getDate()}
                </div>
                
                {/* Mood label for recent days or on hover */}
                {day.mood && (isRecent || isToday) && (
                  <div className="mt-1 text-xs font-medium" style={{ color: colorInfo.bg }}>
                    {day.mood.mood_label}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-dark-400/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Recent days (last 3) are weighted more heavily</span>
          <span>Hover bars for details</span>
        </div>
      </div>
    </div>
  )
}


