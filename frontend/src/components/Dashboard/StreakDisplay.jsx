/**
 * StreakDisplay Component
 * =======================
 * Shows streak information prominently.
 */

export default function StreakDisplay({ streaks }) {
  const { longestStreak, activeCount, habits } = streaks || { 
    longestStreak: 0, 
    activeCount: 0, 
    habits: [] 
  }
  // habits "at risk" (Streak > 0 but not completed today)
  const atRiskHabits = habits.filter(h => 
    h.is_active && 
    h.current_streak > 0 && 
    !h.completed_today
  )
  const atRiskCount = atRiskHabits.length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">⚡</span>
        <h2 className="text-lg font-bold text-gray-900">Your Activity</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-orange-50 border border-orange-100 rounded-xl">
          <span className="text-3xl font-extrabold text-orange-600">
            {longestStreak}
          </span>
          <span className="text-sm font-medium text-orange-800 mt-1">
            Longest Streak
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <span className="text-3xl font-extrabold text-blue-600">
            {activeCount}
          </span>
          <span className="text-sm font-medium text-blue-800 mt-1">
            Active Streaks
          </span>
        </div>
        
        <div className={`flex flex-col items-center justify-center p-4 border rounded-xl ${
          atRiskCount > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
        }`}>
          <span className={`text-3xl font-extrabold ${atRiskCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {atRiskCount}
          </span>
          <span className={`text-sm font-medium mt-1 ${atRiskCount > 0 ? 'text-red-800' : 'text-green-800'}`}>
            {atRiskCount === 1 ? 'Streak At Risk' : 'Streaks At Risk'}
          </span>
        </div>
      </div>

      {atRiskCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Don't lose these streaks!
          </p>
          <div className="flex flex-wrap gap-2">
            {atRiskHabits.slice(0, 3).map(habit => (
              <span key={habit.id} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
                {habit.title} ({habit.current_streak})
              </span>
            ))}
            {atRiskHabits.length > 3 && (
              <span className="text-sm text-gray-500 self-center">
                +{atRiskHabits.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}