/**
 * CreateParty Component
 * =====================
 * [OMAMAH] This is your component to implement.
 * 
 * Form for creating a new party/guild.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import partyService from '../../services/partyService'

export default function CreateParty() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    maxMembers: 20
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name.trim()) {
      setError('Party name is required')
      return
    }
    
    setIsLoading(true)
    
    try {
      const result = await partyService.createParty({
        name: formData.name,
        description: formData.description,
        is_public: formData.isPublic,
        max_members: parseInt(formData.maxMembers)
      })
      navigate(`/parties/${result.id || result.party?.id}`)
    } catch (err) {
      console.error('Party creation error:', err)
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to create party'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-200 mb-6">Create New Party</h1>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Party Name *
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter party name"
            className="input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="What's your party about?"
            className="input resize-none"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-4 h-4 text-accent-500 rounded focus:ring-accent-500"
          />
          <label htmlFor="isPublic" className="text-gray-300">
            Make this party public (anyone can join)
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Maximum Members
          </label>
          <input
            name="maxMembers"
            type="number"
            min="2"
            max="100"
            value={formData.maxMembers}
            onChange={handleChange}
            className="input w-32"
          />
        </div>
        
        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? 'Creating...' : 'Create Party'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

