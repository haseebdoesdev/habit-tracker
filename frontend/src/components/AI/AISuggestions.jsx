/**
 * AISuggestions Component
 * =======================
 * [NOUMAN] This is your component to implement.
 * 
 * Displays AI-powered habit suggestions and allows adding them.
 */

import { useState, useEffect } from 'react'
// TODO: Import aiService
// TODO: Import habitService

export default function AISuggestions() {
  // TODO: Set up state for suggestions
  const [suggestions, setSuggestions] = useState([])
  
  // TODO: Set up state for category filter
  const [category, setCategory] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // TODO: Categories for filtering
  const categories = ['', 'Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness']
  
  const fetchSuggestions = async () => {
    // TODO: Set loading state
    // WHY: Show loading indicator
    
    // TODO: Call AI service for suggestions
    // WHY: Get personalized recommendations
    // APPROACH: await aiService.getSuggestions(category)
    
    // TODO: Update suggestions state
    // WHY: Display the results
    
    // TODO: Handle errors
    // WHY: Show error state if API fails
  }
  
  useEffect(() => {
    // TODO: Fetch suggestions on mount and when category changes
    fetchSuggestions()
  }, [category])
  
  const handleAddHabit = async (suggestion) => {
    // TODO: Create habit from suggestion
    // WHY: Add suggested habit to user's list
    // APPROACH: await habitService.createHabit({
    //   title: suggestion.title,
    //   description: suggestion.description,
    //   category: suggestion.category
    // })
    
    // TODO: Remove from suggestions list
    // WHY: Already added, don't show again
    
    // TODO: Show success feedback
    // WHY: Confirm habit was added
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Suggestions</h1>
        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {/* Category filter */}
      <div className="flex space-x-2">
        {categories.map(cat => (
          <button
            key={cat || 'all'}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Getting AI suggestions...</p>
        </div>
      )}
      
      {/* Suggestions grid */}
      {!isLoading && suggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No suggestions available. Try a different category!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TODO: Map through suggestions */}
        {/*
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg">{suggestion.title}</h3>
            <p className="text-gray-600 mt-2">{suggestion.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                {suggestion.category}
              </span>
              <button
                onClick={() => handleAddHabit(suggestion)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Habit
              </button>
            </div>
          </div>
        ))}
        */}
        
        {/* Placeholder cards */}
        <div className="bg-white rounded-xl shadow p-6 border-2 border-dashed border-gray-200">
          <p className="text-gray-500">AI suggestions will appear here</p>
        </div>
      </div>
    </div>
  )
}

