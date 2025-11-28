/**
 * StreakDisplay Component
 * =======================
 * [NOUMAN] This is your component to implement.
 * 
 * Shows streak information prominently.
 */

export default function StreakDisplay({ streaks }) {
  // TODO: Destructure streak data
  // WHY: Access individual streak values
  // APPROACH: const { longestStreak, totalActiveStreaks, habits } = streaks
  
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Your Streaks 🔥</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* TODO: Longest streak card */}
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-3xl font-bold text-orange-500">
            {/* TODO: streaks.longestStreak */}0
          </p>
          <p className="text-sm text-gray-600">Longest Streak</p>
        </div>
        
        {/* TODO: Active streaks count */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-500">
            {/* TODO: streaks.activeCount */}0
          </p>
          <p className="text-sm text-gray-600">Active Streaks</p>
        </div>
        
        {/* TODO: At-risk streaks */}
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-3xl font-bold text-yellow-500">
            {/* TODO: streaks.atRiskCount */}0
          </p>
          <p className="text-sm text-gray-600">At Risk Today</p>
        </div>
      </div>
      
      {/* TODO: List habits with active streaks */}
      {/* WHY: Show which habits have streaks */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Habits with Streaks</h3>
        
        {/* TODO: Map through habits with streaks */}
        {/* APPROACH: 
        {habits.filter(h => h.currentStreak > 0).map(habit => (
          <div key={habit.id} className="flex justify-between items-center">
            <span>{habit.title}</span>
            <span className="font-bold text-orange-500">
              {habit.currentStreak} days
            </span>
          </div>
        ))}
        */}
        <p className="text-gray-500 text-sm">
          Complete habits to build streaks!
        </p>
      </div>
    </div>
  )
}

