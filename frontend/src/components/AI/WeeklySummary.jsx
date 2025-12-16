/**
 * WeeklySummary Component
 * =======================
 * Displays AI-generated weekly summary and insights.
 */

import { useState, useEffect } from 'react'
import LoadingSpinner from '../Common/LoadingSpinner'
import aiService from '../../services/aiService'
import { ChartIcon } from '../Common/Icons'

export default function WeeklySummary() {
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true)
      try {
        const data = await aiService.getWeeklySummary()
        setSummary(data)
      } catch (err) {
        console.error("Failed to fetch weekly summary:", err)
        setError("Could not generate your weekly summary right now.")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSummary()
  }, [])
  
  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner size="md" message="Loading summary..." />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic text-sm">
        {error}
      </div>
    )
  }
  
  if (!summary) return null

  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-dark-400/50 bg-gradient-to-r from-accent-600/20 to-dark-200/50">
        <div className="flex items-center gap-2 mb-2">
          <ChartIcon className="w-5 h-5 text-accent-400" />
          <h2 className="text-xl font-bold text-gray-200">Weekly AI Report</h2>
        </div>
        <p className="text-gray-400 italic">
          "{summary.summary || "Here is your progress overview for the week."}"
        </p>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Highlights Section */}
        {summary.highlights && summary.highlights.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide flex items-center gap-2">
              <span className="text-sunset-400">⭐</span> Highlights
            </h3>
            <ul className="space-y-2">
              {summary.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start text-gray-300 bg-sunset-600/20 p-3 rounded-soft border border-sunset-500/50">
                  <span className="mr-2 text-sunset-400">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}        
        {summary.insights && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide flex items-center gap-2">
              <span className="text-accent-400">💡</span> Insights
            </h3>
            <div className="bg-accent-600/20 p-4 rounded-soft border border-accent-500/50 text-gray-300 leading-relaxed">
              {summary.insights}
            </div>
          </div>
        )}        
        {summary.recommendations && summary.recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wide flex items-center gap-2">
              <span className="text-solar-400">🚀</span> Next Steps
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {summary.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start p-3 bg-solar-600/20 rounded-soft border border-solar-500/50">
                  <span className="flex-shrink-0 w-6 h-6 bg-solar-500/30 text-solar-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>      
      {(summary.weekOverWeekChange !== undefined) && (
        <div className="px-6 py-3 bg-dark-300/50 border-t border-dark-400/50 flex justify-between items-center text-sm">
          <span className="text-gray-400">vs Last Week</span>
          <span className={`font-semibold ${
            summary.weekOverWeekChange >= 0 ? 'text-solar-400' : 'text-terracotta-400'
          }`}>
            {summary.weekOverWeekChange > 0 && '+'}{summary.weekOverWeekChange}%
          </span>
        </div>
      )}
    </div>
  )
}