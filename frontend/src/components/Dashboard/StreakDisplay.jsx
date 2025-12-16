/**
 * StreakDisplay Component
 * =======================
 * Shows streak information prominently.
 */

import { FireIcon } from '../Common/Icons'

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
    <div className="card mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <FireIcon className="w-5 h-5 text-sunset-400" />
        <h2 className="text-lg font-bold text-gray-200">Your Activity</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-sunset-600/20 border border-sunset-500/50 rounded-organic">
          <span className="text-3xl font-extrabold text-sunset-400">
            {longestStreak}
          </span>
          <span className="text-sm font-medium text-gray-300 mt-1">
            Longest Streak
          </span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-accent-600/20 border border-accent-500/50 rounded-organic">
          <span className="text-3xl font-extrabold text-accent-400">
            {activeCount}
          </span>
          <span className="text-sm font-medium text-gray-300 mt-1">
            Active Streaks
          </span>
        </div>
        
        <div className={`flex flex-col items-center justify-center p-4 border rounded-organic ${
          atRiskCount > 0 ? 'bg-terracotta-600/20 border-terracotta-500/50' : 'bg-solar-600/20 border-solar-500/50'
        }`}>
          <span className={`text-3xl font-extrabold ${atRiskCount > 0 ? 'text-terracotta-400' : 'text-solar-400'}`}>
            {atRiskCount}
          </span>
          <span className="text-sm font-medium text-gray-300 mt-1">
            {atRiskCount === 1 ? 'Streak At Risk' : 'Streaks At Risk'}
          </span>
        </div>
      </div>

      {atRiskCount > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-400">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Don't lose these streaks!
          </p>
          <div className="flex flex-wrap gap-2">
            {atRiskHabits.slice(0, 3).map(habit => (
              <span key={habit.id} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50">
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