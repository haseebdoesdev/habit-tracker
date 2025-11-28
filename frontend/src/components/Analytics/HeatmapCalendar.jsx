/**
 * HeatmapCalendar Component
 * =========================
 * [HASEEB] This is your component to implement.
 * 
 * GitHub-style activity heatmap calendar.
 */

export default function HeatmapCalendar({ data }) {
  // TODO: Process data into calendar format
  // WHY: Organize by weeks/days
  // APPROACH: Group data by week for display
  
  // TODO: Calculate intensity levels
  // WHY: Color coding based on activity
  // APPROACH: Map completion counts to color intensities (0-4 levels)
  
  const getIntensityClass = (count) => {
    // TODO: Return appropriate CSS class based on count
    // WHY: Visual representation of activity level
    // APPROACH: Different background colors for different levels
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 4) return 'bg-green-400'
    if (count <= 6) return 'bg-green-600'
    return 'bg-green-800'
  }
  
  // TODO: Generate weeks/days grid
  // WHY: Calendar layout
  // APPROACH: 52 weeks x 7 days grid
  
  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex mb-2">
        {/* TODO: Add month labels */}
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
        
        {/* TODO: Render calendar grid */}
        {/* WHY: Display activity for each day */}
        <div className="flex gap-1">
          {/* TODO: Map through weeks */}
          {/* Each week is a column of 7 day squares */}
          {/*
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)}`}
                  title={`${day.date}: ${day.count} completions`}
                />
              ))}
            </div>
          ))}
          */}
          <div className="text-gray-500 text-sm py-4">
            Implement calendar grid here
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end mt-4 space-x-2">
        <span className="text-xs text-gray-500">Less</span>
        <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
        <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
        <span className="text-xs text-gray-500">More</span>
      </div>
    </div>
  )
}

