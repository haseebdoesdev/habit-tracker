/**
 * HeatmapCalendar Component
 * GitHub-style activity heatmap calendar
 */

export default function HeatmapCalendar({ data = [] }) {
  // Process data into a map for quick lookup by date
  const dataMap = {}
  data.forEach(item => {
    // Expect data in format: { date: 'YYYY-MM-DD', count: number }
    dataMap[item.date] = item.count || 0
  })

  // Calculate intensity level based on count
  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-dark-400'
    if (count <= 2) return 'bg-solar-600/40'
    if (count <= 4) return 'bg-solar-500/60'
    if (count <= 6) return 'bg-solar-500/80'
    return 'bg-solar-500'
  }

  // Generate weeks grid (52 weeks x 7 days)
  const generateWeeks = () => {
    const weeks = []
    const today = new Date()

    // Start from 52 weeks ago
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    // Adjust to start from Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay())

    const currentDate = new Date(startDate)

    for (let week = 0; week < 53; week++) {
      const days = []
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const count = dataMap[dateStr] || 0

        days.push({
          date: dateStr,
          count: count,
          isToday: dateStr === today.toISOString().split('T')[0],
          isFuture: currentDate > today
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }
      weeks.push(days)
    }

    return weeks
  }

  const weeks = generateWeeks()

  // Format date for tooltip
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex mb-2">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
          <span key={month} className="text-xs text-gray-400 flex-1">
            {month}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2">
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
            <span key={i} className="text-xs text-gray-400 h-3">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${day.isFuture
                      ? 'bg-dark-400'
                      : getIntensityClass(day.count)
                    } ${day.isToday ? 'ring-1 ring-accent-500' : ''}`}
                  title={`${formatDate(day.date)}: ${day.count} completions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end mt-4 space-x-2">
        <span className="text-xs text-gray-400">Less</span>
        <div className="w-3 h-3 bg-dark-400 rounded-sm"></div>
        <div className="w-3 h-3 bg-solar-600/40 rounded-sm"></div>
        <div className="w-3 h-3 bg-solar-500/60 rounded-sm"></div>
        <div className="w-3 h-3 bg-solar-500/80 rounded-sm"></div>
        <div className="w-3 h-3 bg-solar-500 rounded-sm"></div>
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  )
}
