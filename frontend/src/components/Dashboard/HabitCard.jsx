/**
 * HabitCard Component
 * ===================
 * Displays a single habit card with completion toggle and streak info.
 */

import { Link } from 'react-router-dom'
import { FireIcon } from '../Common/Icons'

export default function HabitCard({ habit, onComplete, isCompletedToday }) {
  const { id, title, description, category, current_streak } = habit

  const getCategoryBadgeColor = (cat) => {
    const category = cat?.toLowerCase() || 'other'
    
    const colors = {
      health: 'badge-success',
      fitness: 'badge bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50',
      learning: 'badge bg-sky-600/30 text-sky-300 border border-sky-500/50',
      productivity: 'badge bg-martian-600/30 text-martian-300 border border-martian-500/50',
      mindfulness: 'badge bg-solar-600/30 text-solar-300 border border-solar-500/50',
      social: 'badge bg-sunset-600/30 text-sunset-300 border border-sunset-500/50',
      financial: 'badge-success',
      creative: 'badge bg-terracotta-600/30 text-terracotta-300 border border-terracotta-500/50',
      other: 'badge'
    }

    return colors[category] || colors.other
  }

  return (
    <div className={`flex items-center justify-between p-5 rounded-organic border transition-all duration-300 ${
      isCompletedToday 
        ? 'bg-solar-600/20 border-solar-500/50 shadow-soft' 
        : 'bg-dark-200/60 backdrop-blur-sm border-dark-400/50 hover:border-dark-500/50 hover:shadow-gentle'
    }`}>
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onComplete(id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solar-400 ${
            isCompletedToday 
              ? 'bg-gradient-to-br from-solar-400 to-solar-500 border-solar-500 text-white shadow-soft glow-solar' 
              : 'border-dark-500 text-transparent hover:border-solar-400 hover:bg-solar-600/20'
          }`}
          aria-label={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <Link 
              to={`/habits/${id}/edit`}
              className={`font-semibold text-lg hover:underline transition-colors ${
                isCompletedToday 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-200 hover:text-accent-400'
              }`}
            >
              {title}
            </Link>
            
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
          
          {description && (
            <p className="text-sm text-gray-400 truncate max-w-xs mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-5 ml-4">
        <div className="text-center">
          <div className="flex items-center space-x-1 text-sunset-400" title="Current Streak">
            <FireIcon className="w-5 h-5" />
            <span className="text-lg font-bold">{current_streak}</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">streak</span>
        </div>
        
        <Link 
          to={`/habits/${id}/edit`}
          className="p-2 text-gray-500 hover:text-accent-400 hover:bg-dark-300 rounded-soft transition-all duration-200"
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