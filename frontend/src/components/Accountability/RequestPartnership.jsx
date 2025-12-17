/**
 * Request Partnership Component
 * Search for users and send accountability partnership requests
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import accountabilityService from '../../services/accountabilityService'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function RequestPartnership() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (query.trim().length < 3) {
      setError('Please enter at least 3 characters to search')
      return
    }
    
    setIsSearching(true)
    setError('')
    
    try {
      const data = await accountabilityService.searchUsers(query.trim())
      setResults(data)
      if (data.length === 0) {
        setError('No users found. Try a different search.')
      }
    } catch (err) {
      setError(err.message || 'Failed to search users')
      console.error('Failed to search users:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setResults([])
    setQuery('')
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    
    if (!selectedUser) {
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await accountabilityService.requestPartnership(selectedUser.id, message || null)
      navigate('/accountability', { state: { message: 'Partnership request sent successfully!' } })
    } catch (err) {
      setError(err.message || 'Failed to send partnership request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSelectedUser(null)
    setMessage('')
    setQuery('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-200">Request Partnership</h1>
        <p className="text-gray-400 mt-1">
          Find and request an accountability partner
        </p>
      </div>

      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">
          {error}
        </div>
      )}

      {!selectedUser ? (
        <>
          {/* Search Form */}
          <div className="card">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Search for Users
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by username or email (minimum 3 characters)"
                    className="input flex-1"
                    minLength={3}
                  />
                  <button
                    type="submit"
                    disabled={isSearching || query.trim().length < 3}
                    className="btn-primary"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter at least 3 characters to search
                </p>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-medium text-gray-200 mb-4">Search Results</h2>
              <div className="space-y-3">
                {results.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-dark-400/50 rounded-soft hover:bg-dark-300/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
                          className="w-10 h-10 rounded-full border border-dark-400"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-medium shadow-soft">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-200">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Selected User and Message Form */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-200">Send Partnership Request</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Change User
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-4 bg-dark-300/50 rounded-soft border border-dark-400/50">
              {selectedUser.avatar_url ? (
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.username}
                  className="w-12 h-12 rounded-full border border-dark-400"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-medium shadow-soft">
                  {selectedUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-200">{selectedUser.username}</p>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Optional Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message (optional)"
                  className="input resize-none"
                  rows="4"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/accountability')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}



