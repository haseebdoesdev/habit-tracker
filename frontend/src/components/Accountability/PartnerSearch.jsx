/**
 * PartnerSearch Component
 * =======================
 * [HASEEB] This is your component to implement.
 * 
 * Search for users to partner with.
 */

import { useState } from 'react'
import accountabilityService from '../../services/accountabilityService'

export default function PartnerSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!query.trim()) {
      return
    }
    
    setIsSearching(true)
    
    try {
      const data = await accountabilityService.searchUsers(query.trim())
      setResults(data)
    } catch (err) {
      console.error("Failed to search users:", err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }
  
  const handleSendRequest = async (userId) => {
    try {
      await accountabilityService.requestPartnership(userId, message || null)
      setResults(results.filter(user => user.id !== userId))
      setMessage('')
      // Success feedback: user removed from results indicates request sent
    } catch (err) {
      console.error("Failed to send partnership request:", err)
    }
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Find Accountability Partners</h2>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex space-x-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username or email"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {/* Search results */}
      <div className="space-y-3">
        {results.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => handleSendRequest(user.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Request Partnership
            </button>
          </div>
        ))}
        
        {results.length === 0 && query && !isSearching && (
          <p className="text-gray-500 text-center py-4">
            No users found. Try a different search.
          </p>
        )}
        
        {!query && (
          <p className="text-gray-500 text-center py-4">
            Search for users to send partnership requests
          </p>
        )}
      </div>
    </div>
  )
}

