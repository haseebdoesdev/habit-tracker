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
      setError(err.message || 'Failed to create party')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Party</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Party Name *
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter party name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="What's your party about?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="isPublic" className="text-gray-700">
            Make this party public (anyone can join)
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Members
          </label>
          <input
            name="maxMembers"
            type="number"
            min="2"
            max="100"
            value={formData.maxMembers}
            onChange={handleChange}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Submit */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Party'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

