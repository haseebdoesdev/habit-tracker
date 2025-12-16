/**
 * PartnerRequest Component
 * ========================
 * [OMAMAH] This is your component to implement.
 * 
 * Handle incoming/outgoing partnership requests.
 */

import { useState, useEffect } from 'react'
import LoadingState from '../Common/LoadingState'
import accountabilityService from '../../services/accountabilityService'

export default function PartnerRequest() {
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const partnerships = await accountabilityService.getPartnerships({ status: 'pending' })
        
        // Separate into incoming and outgoing based on requester
        // Note: This assumes the API returns partnerships with requester info
        const incoming = Array.isArray(partnerships) 
          ? partnerships.filter(p => p.status === 'pending' && p.requester_id !== p.current_user_id)
          : []
        const outgoing = Array.isArray(partnerships)
          ? partnerships.filter(p => p.status === 'pending' && p.requester_id === p.current_user_id)
          : []
        
        setIncomingRequests(incoming)
        setOutgoingRequests(outgoing)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load requests')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRequests()
  }, [])
  
  const handleRespond = async (partnershipId, accept) => {
    try {
      await accountabilityService.respondToRequest(partnershipId, accept)
      setIncomingRequests(prev => prev.filter(r => r.id !== partnershipId))
    } catch (err) {
      setError(err.message || 'Failed to respond to request')
    }
  }
  
  const handleCancel = async (partnershipId) => {
    try {
      await accountabilityService.endPartnership(partnershipId)
      setOutgoingRequests(prev => prev.filter(r => r.id !== partnershipId))
    } catch (err) {
      setError(err.message || 'Failed to cancel request')
    }
  }
  
  if (isLoading) {
    return <LoadingState message="Loading requests..." fullPage />
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Partnership Requests</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Incoming Requests</h3>
        
        {incomingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          incomingRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {request.requester_username?.charAt(0).toUpperCase() || request.requesterUsername?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{request.requester_username || request.requesterUsername || 'Unknown'}</p>
                  {request.message && (
                    <p className="text-sm text-gray-500">"{request.message}"</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRespond(request.id, true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespond(request.id, false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Sent Requests</h3>
        
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-500">No pending sent requests</p>
        ) : (
          outgoingRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {request.partner_username?.charAt(0).toUpperCase() || request.partnerUsername?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium">{request.partner_username || request.partnerUsername || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">Awaiting response</p>
                </div>
              </div>
              <button
                onClick={() => handleCancel(request.id)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel Request
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

