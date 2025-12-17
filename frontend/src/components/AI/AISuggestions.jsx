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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-200">
            Personalized habit ideas powered by AI
          </h2>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={isLoading}
          className="btn-secondary text-sm px-4 py-2"
        >
          {isLoading ? 'Thinking...' : 'Refresh Ideas'}
        </button>
      </div>      
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id || 'all'}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              category === cat.id
                ? 'bg-accent-500 text-white shadow-soft'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-dark-400/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic text-sm">
          {error}
        </div>
      )}      
      {isLoading && (
        <div className="text-center py-12 card border-dashed">
          <LoadingSpinner size="md" message={`Asking AI for ${category || 'new'} habit ideas...`} />
        </div>
      )}      
      {!isLoading && suggestions.length === 0 && !error && (
        <div className="text-center py-12 card border-dashed">
          <p className="text-gray-400">No suggestions found. Try a different category!</p>
        </div>
      )}      
      {!isLoading && suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="card flex flex-col hover:shadow-gentle transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-200">{suggestion.title}</h3>
                <span className="px-3 py-1 bg-white/20 text-gray-300 text-xs rounded-full font-medium border border-dark-400/50">
                  {suggestion.category}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 flex-grow">
                {suggestion.description}
              </p>
              
              <button
                onClick={() => handleAddHabit(suggestion, index)}
                disabled={addingId !== null}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-accent-400 hover:text-accent-300 rounded-soft font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 border border-accent-500/30 hover:border-accent-500/50"
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