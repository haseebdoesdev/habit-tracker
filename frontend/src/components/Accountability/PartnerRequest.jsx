/**
 * PartnerRequest Component
 * ========================
 * [OMAMAH] This is your component to implement.
 * 
 * Handle incoming/outgoing partnership requests.
 */

import { useState, useEffect } from 'react'
// TODO: Import accountabilityService

export default function PartnerRequest() {
  // TODO: Set up state for requests
  const [incomingRequests, setIncomingRequests] = useState([])
  const [outgoingRequests, setOutgoingRequests] = useState([])
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch pending requests
    // WHY: Show requests to respond to
    // APPROACH: await accountabilityService.getPartnerships({ status: 'pending' })
    // Separate into incoming and outgoing based on requester
  }, [])
  
  const handleRespond = async (partnershipId, accept) => {
    // TODO: Accept or decline request
    // WHY: Respond to partnership request
    // APPROACH: await accountabilityService.respondToRequest(partnershipId, accept)
    
    // TODO: Remove from incoming requests
    // WHY: Already responded
    
    // TODO: Show feedback
    // WHY: Confirm action
  }
  
  const handleCancel = async (partnershipId) => {
    // TODO: Cancel outgoing request
    // WHY: Withdraw request
    // APPROACH: await accountabilityService.cancelRequest(partnershipId)
    
    // TODO: Remove from outgoing requests
    // WHY: Request cancelled
  }
  
  if (isLoading) {
    return <div className="text-center py-8">Loading requests...</div>
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Partnership Requests</h2>
      
      {/* Incoming requests */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Incoming Requests</h3>
        
        {incomingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests</p>
        ) : (
          /* TODO: Map through incoming requests */
          /*
          {incomingRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {request.requesterUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{request.requesterUsername}</p>
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
          ))}
          */
          <p className="text-gray-500">Incoming requests will appear here</p>
        )}
      </div>
      
      {/* Outgoing requests */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Sent Requests</h3>
        
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-500">No pending sent requests</p>
        ) : (
          /* TODO: Map through outgoing requests */
          /*
          {outgoingRequests.map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {request.partnerUsername.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{request.partnerUsername}</p>
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
          ))}
          */
          <p className="text-gray-500">Sent requests will appear here</p>
        )}
      </div>
    </div>
  )
}

