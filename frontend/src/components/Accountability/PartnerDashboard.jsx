/**
 * PartnerDashboard Component
 * ==========================
 * View partners, select them, and track their progress.
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import accountabilityService from '../../services/accountabilityService'
import PartnerComments from './PartnerComments'

export default function PartnerDashboard() {
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
    if (!selectedPartner) return
    
    const fetchPartnerDetails = async () => {
      setLoadingHabits(true)
      try {
        // Use the partner_id from the partnership object
        // The API returns 'partner_id' but usually we need the user ID of the partner
        // Check schema: if I am requester, partner is partner_id. If I am partner, partner is requester_id.
        // The service normally normalizes this, but let's assume the object has a 'partner_id' 
        // that represents the OTHER user ID based on backend logic usually simplifying this.
        // Based on provided backend logic, the response handles this logic.
        
        const targetId = selectedPartner.partner_id || selectedPartner.id 
        
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
  }, [selectedPartner])
  
  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading partners...</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Accountability Partners</h1>
        <div className="flex gap-3">
          <Link to="/accountability/search" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Find Partners
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/accountability/requests" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Requests
          </Link>
        </div>
      </div>
      
      {partnerships.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 border-dashed">
          <span className="text-4xl block mb-3">🤝</span>
          <h3 className="text-lg font-medium text-gray-900">No partners yet</h3>
          <p className="text-gray-500 mb-6">Partner up to keep each other accountable!</p>
          <Link
            to="/accountability/search"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Find a Partner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Partner List Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50">
                <h3 className="font-semibold text-gray-700">Your Partners</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {partnerships.map(partnership => (
                  <button
                    key={partnership.id}
                    onClick={() => setSelectedPartner(partnership)}
                    className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left ${
                      selectedPartner?.id === partnership.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                      {partnership.partner_username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className={`font-medium truncate ${
                        selectedPartner?.id === partnership.id ? 'text-blue-700' : 'text-gray-900'
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
              <div className="bg-white h-64 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : partnerData ? (
              <div className="space-y-6">
                {/* Partner Stats Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {partnerData.partner_username}'s Progress
                  </h2>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="block text-2xl font-bold text-blue-600">
                        {partnerData.habits?.length || 0}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Active Habits</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="block text-2xl font-bold text-orange-500">
                        {Math.max(...(partnerData.current_streaks || [0]))}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Best Streak</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="block text-2xl font-bold text-green-600">
                        {Math.round(partnerData.overall_completion_rate || 0)}%
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Completion</span>
                    </div>
                  </div>
                </div>

                {/* Partner Habits List */}
                <div className="grid grid-cols-1 gap-4">
                  {partnerData.habits?.map(habit => (
                    <div key={habit.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg text-gray-900">{habit.title}</h4>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {habit.category}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">{habit.description}</p>
                        </div>
                        <div className="text-center bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                          <span className="block text-xl font-bold text-orange-500">
                            {habit.current_streak}
                          </span>
                          <span className="text-xs text-orange-700">day streak</span>
                        </div>
                      </div>
                      
                      {/* Comments Section for this habit */}
                      <div className="mt-4 pt-4 border-t border-gray-50">
                        <PartnerComments habitId={habit.id} />
                      </div>
                    </div>
                  ))}
                  
                  {(!partnerData.habits || partnerData.habits.length === 0) && (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-100">
                      This partner hasn't shared any public habits yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">Select a partner to view their progress.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}