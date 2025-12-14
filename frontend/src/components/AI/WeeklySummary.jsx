/**
 * WeeklySummary Component
 * =======================
 * Displays AI-generated weekly summary and insights.
 */

import { useState, useEffect } from 'react'
import aiService from '../../services/aiService'

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
        {error}
      </div>
    )
  }
  
  if (!summary) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📊</span>
          <h2 className="text-xl font-bold text-gray-900">Weekly AI Report</h2>
        </div>
        <p className="text-gray-600 italic">
          "{summary.summary || "Here is your progress overview for the week."}"
        </p>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Highlights Section */}
        {summary.highlights && summary.highlights.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <span className="text-yellow-500">⭐</span> Highlights
            </h3>
            <ul className="space-y-2">
              {summary.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <span className="mr-2 text-yellow-600">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}        
        {summary.insights && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <span className="text-purple-500">💡</span> Insights
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-gray-700 leading-relaxed">
              {summary.insights}
            </div>
          </div>
        )}        
        {summary.recommendations && summary.recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <span className="text-green-500">🚀</span> Next Steps
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {summary.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-200 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>      
      {(summary.weekOverWeekChange !== undefined) && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="text-gray-500">vs Last Week</span>
          <span className={`font-semibold ${
            summary.weekOverWeekChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.weekOverWeekChange > 0 && '+'}{summary.weekOverWeekChange}%
          </span>
        </div>
      )}
    </div>
  )
}