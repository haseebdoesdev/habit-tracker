/**
 * PartnerSearch Component
 * =======================
 * [HASEEB] This is your component to implement.
 * 
 * Search for users to partner with.
 */

import { useState } from 'react'
// TODO: Import accountabilityService

export default function PartnerSearch() {
  // TODO: Set up search state
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleSearch = async (e) => {
    e.preventDefault()
    
    // TODO: Validate query
    // WHY: Don't search empty string
    
    // TODO: Set loading state
    // WHY: Show searching indicator
    
    // TODO: Call search API
    // WHY: Find users matching query
    // APPROACH: await accountabilityService.searchUsers(query)
    
    // TODO: Update results
    // WHY: Display found users
    
    // TODO: Handle errors
    // WHY: Show error state
  }
  
  const handleSendRequest = async (userId) => {
    // TODO: Send partnership request
    // WHY: Initiate partnership
    // APPROACH: await accountabilityService.requestPartnership(userId, message)
    
    // TODO: Remove from results
    // WHY: Already requested
    
    // TODO: Show success feedback
    // WHY: Confirm request sent
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
        {/* TODO: Map through results */}
        {/*
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
        */}
        
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

