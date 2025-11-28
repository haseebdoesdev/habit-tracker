/**
 * HabitCard Component
 * ===================
 * [NOUMAN] This is your component to implement.
 * 
 * Displays a single habit with completion toggle.
 */

// TODO: Import Link from react-router-dom
// WHY: Navigate to habit details

export default function HabitCard({ habit, onComplete, isCompletedToday }) {
  // TODO: Destructure habit properties
  // WHY: Easy access to habit data
  // APPROACH: const { id, title, description, category, currentStreak } = habit
  
  const handleComplete = () => {
    // TODO: Call onComplete callback
    // WHY: Notify parent to mark as complete
    // APPROACH: onComplete(habit.id)
  }
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        {/* TODO: Completion checkbox/button */}
        {/* WHY: Toggle completion status */}
        <button
          onClick={handleComplete}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isCompletedToday 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {/* TODO: Show checkmark if completed */}
          {isCompletedToday && '✓'}
        </button>
        
        <div>
          {/* TODO: Habit title with link to details */}
          <h3 className="font-medium text-gray-900">
            {/* TODO: Replace with actual habit title */}
            Habit Title
          </h3>
          
          {/* TODO: Show category badge */}
          {/* WHY: Visual organization */}
          <span className="text-sm text-gray-500">
            Category
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* TODO: Display current streak */}
        {/* WHY: Motivation through visible progress */}
        <div className="text-center">
          <span className="text-lg font-bold text-orange-500">
            {/* TODO: habit.currentStreak */}0
          </span>
          <span className="text-xs text-gray-500 block">streak</span>
        </div>
        
        {/* TODO: Link to edit habit */}
        {/* WHY: Quick access to settings */}
        <button className="text-gray-400 hover:text-gray-600">
          ⚙️
        </button>
      </div>
    </div>
  )
}

