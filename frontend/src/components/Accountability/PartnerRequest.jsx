/**
 * PartnerRequest Component
 * ========================
 * [OMAMAH] This is your component to implement.
 * 
 * Handle incoming/outgoing partnership requests.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingState from '../Common/LoadingState'
import accountabilityService from '../../services/accountabilityService'

export default function PartnerRequest() {
  const { user } = useAuth()
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
        // Incoming: requests where current user is the partner (they received the request)
        // Outgoing: requests where current user is the requester (they sent the request)
        if (Array.isArray(partnerships) && user) {
          const incoming = partnerships.filter(p => 
            (p.status === 'PENDING' || p.status === 'pending') && p.partner_id === user.id
          )
          const outgoing = partnerships.filter(p => 
            (p.status === 'PENDING' || p.status === 'pending') && p.requester_id === user.id
          )
          
          setIncomingRequests(incoming)
          setOutgoingRequests(outgoing)
        } else {
          setIncomingRequests([])
          setOutgoingRequests([])
        }
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to load requests')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRequests()
  }, [user])
  
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-200">Partnership Requests</h1>
        <Link
          to="/accountability"
          className="link text-sm"
        >
          Back to Partners
        </Link>
      </div>
      
      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-3 rounded-organic">{error}</div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-300">Incoming Requests</h3>
        
        {incomingRequests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No pending requests</p>
          </div>
        ) : (
          incomingRequests.map(request => (
            <div key={request.id} className="card flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {request.partner_avatar_url ? (
                  <img
                    src={request.partner_avatar_url}
                    alt={request.partner_username}
                    className="w-10 h-10 rounded-full border border-dark-400"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-medium shadow-soft">
                    {request.partner_username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-200">{request.partner_username || 'Unknown'}</p>
                  {request.message && (
                    <p className="text-sm text-gray-400">"{request.message}"</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {request.created_at ? new Date(request.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRespond(request.id, true)}
                  className="btn-primary bg-solar-500 hover:bg-solar-600 text-sm px-4 py-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespond(request.id, false)}
                  className="px-4 py-2 bg-terracotta-500 text-white rounded-organic hover:bg-terracotta-600 transition-colors text-sm"
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-gray-300">Sent Requests</h3>
        
        {outgoingRequests.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">No pending sent requests</p>
          </div>
        ) : (
          outgoingRequests.map(request => (
            <div key={request.id} className="card flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {request.partner_avatar_url ? (
                  <img
                    src={request.partner_avatar_url}
                    alt={request.partner_username}
                    className="w-10 h-10 rounded-full border border-dark-400"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-medium shadow-soft">
                    {request.partner_username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-200">{request.partner_username || 'Unknown'}</p>
                  {request.message && (
                    <p className="text-sm text-gray-400">"{request.message}"</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {request.created_at ? new Date(request.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCancel(request.id)}
                className="btn-secondary text-sm px-4 py-2"
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

