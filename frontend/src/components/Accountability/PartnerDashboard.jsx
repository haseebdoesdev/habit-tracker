/**
 * PartnerDashboard Component
 * ==========================
 * View partners, select them, and track their progress.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import accountabilityService from '../../services/accountabilityService'
import PartnerComments from './PartnerComments'
import { useAuth } from '../../context/AuthContext'
import LoadingState from '../Common/LoadingState'
import LoadingSpinner from '../Common/LoadingSpinner'
import { HandshakeIcon } from '../Common/Icons'

export default function PartnerDashboard() {
  const { user } = useAuth()
  const [partnerships, setPartnerships] = useState([])
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [partnerData, setPartnerData] = useState(null) // Includes habits & stats
  
  const [isLoading, setIsLoading] = useState(true)
  const [loadingHabits, setLoadingHabits] = useState(false)
  
  // Fetch partnerships on mount
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const data = await accountabilityService.getPartnerships({ status: 'active' })
        setPartnerships(data)
        
        // Auto-select first partner if available
        if (data.length > 0) {
          setSelectedPartner(data[0])
        }
      } catch (err) {
        console.error("Failed to load partnerships:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPartnerships()
  }, [])
  
  // Fetch partner details when selected
  useEffect(() => {
    if (!selectedPartner || !user) return
    
    const fetchPartnerDetails = async () => {
      setLoadingHabits(true)
      try {
        // Determine the correct partner user ID
        // If current user is the requester, partner_id is the other user
        // If current user is the partner, requester_id is the other user
        const targetId = selectedPartner.requester_id === user.id 
          ? selectedPartner.partner_id 
          : selectedPartner.requester_id
        
        const data = await accountabilityService.getPartnerHabits(targetId)
        setPartnerData(data)
      } catch (err) {
        console.error("Failed to load partner habits:", err)
        setPartnerData(null)
      } finally {
        setLoadingHabits(false)
      }
    }
    
    fetchPartnerDetails()
  }, [selectedPartner, user])
  
  if (isLoading) {
    return <LoadingState message="Loading partners..." fullPage />
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-200">Accountability Partners</h1>
        <div className="flex gap-3">
          <Link to="/accountability/request" className="link text-sm">
            Find Partners
          </Link>
          <span className="text-gray-500">|</span>
          <Link to="/accountability/requests" className="link text-sm">
            Requests
          </Link>
        </div>
      </div>
      
      {partnerships.length === 0 ? (
        <div className="empty-state card border-dashed">
          <HandshakeIcon className="empty-state-icon text-gray-600" />
          <h3 className="empty-state-text">No partners yet</h3>
          <p className="empty-state-subtext mb-6">Partner up to keep each other accountable!</p>
          <Link
            to="/accountability/request"
            className="btn-primary"
          >
            Find a Partner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Partner List Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-dark-400/50 bg-dark-300/50">
                <h3 className="font-semibold text-gray-200">Your Partners</h3>
              </div>
              <div className="divide-y divide-dark-400/50">
                {partnerships.map(partnership => (
                  <button
                    key={partnership.id}
                    onClick={() => setSelectedPartner(partnership)}
                    className={`w-full flex items-center p-4 hover:bg-dark-300/50 transition-colors text-left ${
                      selectedPartner?.id === partnership.id ? 'bg-accent-600/20 border-l-4 border-accent-500' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold shadow-soft">
                      {partnership.partner_username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className={`font-medium truncate ${
                        selectedPartner?.id === partnership.id ? 'text-accent-300' : 'text-gray-200'
                      }`}>
                        {partnership.partner_username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Since {new Date(partnership.accepted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Partner Detail View */}
          <div className="md:col-span-8 lg:col-span-9">
            {loadingHabits ? (
              <div className="card h-64 flex items-center justify-center">
                <LoadingSpinner size="md" message="Loading habits..." />
              </div>
            ) : partnerData ? (
              <div className="space-y-6">
                {/* Partner Stats Header */}
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-200 mb-4">
                    {partnerData.partner_username}'s Progress
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-dark-300/50 rounded-soft p-3 border border-dark-400/50">
                      <span className="block text-2xl font-bold text-accent-400">
                        {partnerData.habits?.length || 0}
                      </span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Active Habits</span>
                    </div>
                    <div className="bg-dark-300/50 rounded-soft p-3 border border-dark-400/50">
                      <span className="block text-2xl font-bold text-sunset-400">
                        {Math.max(...(partnerData.current_streaks || [0]))}
                      </span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Best Streak</span>
                    </div>
                    <div className="bg-dark-300/50 rounded-soft p-3 border border-dark-400/50">
                      <span className="block text-2xl font-bold text-solar-400">
                        {Math.round(partnerData.overall_completion_rate || 0)}%
                      </span>
                      <span className="text-xs text-gray-400 uppercase tracking-wide">Completion</span>
                    </div>
                  </div>
                </div>

                {/* Partner Habits List */}
                <div className="grid grid-cols-1 gap-4">
                  {partnerData.habits?.map(habit => (
                    <div key={habit.id} className="card">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-gray-200">{habit.title}</h4>
                            <span className="badge">
                              {habit.category}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{habit.description}</p>
                        </div>
                        <div className="text-center bg-sunset-600/20 px-3 py-1 rounded-soft border border-sunset-500/50">
                          <span className="block text-xl font-bold text-sunset-400">
                            {habit.current_streak}
                          </span>
                          <span className="text-xs text-gray-400">day streak</span>
                        </div>
                      </div>
                      
                      {/* Comments Section for this habit */}
                      <div className="mt-4 pt-4 border-t border-dark-400/50">
                        <PartnerComments habitId={habit.id} />
                      </div>
                    </div>
                  ))}
                  
                  {(!partnerData.habits || partnerData.habits.length === 0) && (
                    <div className="empty-state card">
                      <p className="empty-state-text">This partner hasn't shared any public habits yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state card">
                <p className="empty-state-text">Select a partner to view their progress.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}