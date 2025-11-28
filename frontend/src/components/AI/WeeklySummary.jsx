/**
 * WeeklySummary Component
 * =======================
 * [NOUMAN] This is your component to implement.
 * 
 * Displays AI-generated weekly summary and insights.
 */

import { useState, useEffect } from 'react'
// TODO: Import aiService

export default function WeeklySummary() {
  // TODO: Set up state for summary data
  const [summary, setSummary] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // TODO: Fetch weekly summary from AI
    // WHY: Get personalized insights
    // APPROACH: await aiService.getWeeklySummary()
    
    const fetchSummary = async () => {
      // TODO: Set loading
      // TODO: Call API
      // TODO: Update state
      // TODO: Handle errors
    }
    
    fetchSummary()
  }, [])
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Weekly Summary</h2>
      
      {/* TODO: Highlights section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Highlights</h3>
        {/* TODO: Display key achievements from the week */}
        {/*
        <ul className="list-disc pl-5 space-y-2">
          {summary?.highlights?.map((highlight, i) => (
            <li key={i} className="text-gray-600">{highlight}</li>
          ))}
        </ul>
        */}
        <p className="text-gray-500">Your weekly highlights will appear here</p>
      </div>
      
      {/* TODO: Insights section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">AI Insights</h3>
        {/* TODO: Display AI-generated insights */}
        {/*
        <p className="text-gray-600">{summary?.insights}</p>
        */}
        <p className="text-gray-500">
          AI-powered insights about your habit patterns will appear here
        </p>
      </div>
      
      {/* TODO: Recommendations section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Recommendations</h3>
        {/* TODO: Display actionable recommendations */}
        {/*
        <ul className="space-y-3">
          {summary?.recommendations?.map((rec, i) => (
            <li key={i} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <span className="text-gray-600">{rec}</span>
            </li>
          ))}
        </ul>
        */}
        <p className="text-gray-500">
          Personalized recommendations will appear here
        </p>
      </div>
      
      {/* TODO: Week comparison */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Compared to last week:</span>
          {/* TODO: Show improvement/decline indicator */}
          <span className="text-green-600 font-semibold">
            {/* summary?.weekOverWeekChange */}+5% improvement
          </span>
        </div>
      </div>
    </div>
  )
}

