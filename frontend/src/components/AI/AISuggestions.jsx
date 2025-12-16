/**
 * AISuggestions Component
 * =======================
 * Displays AI-powered habit suggestions and allows adding them.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Common/LoadingSpinner'
import aiService from '../../services/aiService' // Assuming this service exists
import habitService from '../../services/habitService'

export default function AISuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [addingId, setAddingId] = useState(null) // Track which item is being added
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  const categories = [
    { id: '', label: 'All' },
    { id: 'Health', label: 'Health' },
    { id: 'Fitness', label: 'Fitness' },
    { id: 'Learning', label: 'Learning' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Mindfulness', label: 'Mindfulness' }
  ]
  
  const fetchSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch suggestions from AI service
      const data = await aiService.getSuggestions(category)
      setSuggestions(data)
    } catch (err) {
      console.error("Failed to fetch suggestions:", err)
      setError("Failed to load suggestions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }  
  useEffect(() => {
    fetchSuggestions()
  }, [category])
  
  const handleAddHabit = async (suggestion, index) => {
    setAddingId(index)
    try {
      await habitService.createHabit({
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category || 'Other',
        frequency: 'daily' // Default to daily
      })      
      setSuggestions(prev => prev.filter((_, i) => i !== index))
      // navigate('/habits') 
    } catch (err) {
      console.error("Failed to add habit:", err)
      setError("Failed to create habit. Please try again.")
    } finally {
      setAddingId(null)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>✨</span> AI Suggestions
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Personalized habit ideas powered by Gemini
          </p>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {isLoading ? 'Thinking...' : 'Refresh Ideas'}
        </button>
      </div>      
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id || 'all'}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>      
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}      
      {isLoading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
          <LoadingSpinner size="md" message={`Asking AI for ${category || 'new'} habit ideas...`} />
        </div>
      )}      
      {!isLoading && suggestions.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
          <p className="text-gray-500">No suggestions found. Try a different category!</p>
        </div>
      )}      
      {!isLoading && suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{suggestion.title}</h3>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  {suggestion.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {suggestion.description}
              </p>
              
              <button
                onClick={() => handleAddHabit(suggestion, index)}
                disabled={addingId !== null}
                className="w-full py-2 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                {addingId === index ? (
                  <>Adding...</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add to My Habits
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}