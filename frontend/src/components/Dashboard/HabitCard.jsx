/**
 * HabitCard Component
 * ===================
 * Displays a single habit card with completion toggle and streak info.
 */

import { Link } from 'react-router-dom'

export default function HabitCard({ habit, onComplete, isCompletedToday }) {
  const { id, title, description, category, current_streak } = habit

  const getCategoryBadgeColor = (cat) => {
    const category = cat?.toLowerCase() || 'other'
    
    const colors = {
      health: 'bg-green-100 text-green-800',
      fitness: 'bg-red-100 text-red-800',
      learning: 'bg-blue-100 text-blue-800',
      productivity: 'bg-purple-100 text-purple-800',
      mindfulness: 'bg-teal-100 text-teal-800',
      social: 'bg-yellow-100 text-yellow-800',
      financial: 'bg-emerald-100 text-emerald-800',
      creative: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    }

    return colors[category] || colors.other
  }

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
      isCompletedToday 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm'
    }`}>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onComplete(id)}
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            isCompletedToday 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 text-transparent hover:border-green-500'
          }`}
          aria-label={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Link 
              to={`/habits/${id}/edit`}
              className={`font-semibold text-lg hover:underline ${isCompletedToday ? 'text-gray-500 line-through' : 'text-gray-900'}`}
            >
              {title}
            </Link>
            
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 truncate max-w-xs mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-5">
        <div className="text-center">
          <div className="flex items-center space-x-1 text-orange-500" title="Current Streak">
            <span className="text-xl">🔥</span>
            <span className="text-lg font-bold">{current_streak}</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">streak</span>
        </div>
        
        <Link 
          to={`/habits/${id}/edit`}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Habit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
      </div>
    </div>
  )
}