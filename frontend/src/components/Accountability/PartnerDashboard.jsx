/**
 * PartnerDashboard Component
 * ==========================
 * [NOUMAN] This is your component to implement.
 * 
 * View partner's habits and progress.
 */

import { useState, useEffect } from 'react'
// TODO: Import accountabilityService

export default function PartnerDashboard() {
  // TODO: Set up state for partnerships
  const [partnerships, setPartnerships] = useState([])
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [partnerHabits, setPartnerHabits] = useState([])
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Fetch user's partnerships
    // WHY: Show active partners
    // APPROACH: await accountabilityService.getPartnerships({ status: 'active' })
  }, [])
  
  useEffect(() => {
    // TODO: Fetch partner's habits when partner is selected
    // WHY: Show partner's progress
    // APPROACH: await accountabilityService.getPartnerHabits(selectedPartner.id)
  }, [selectedPartner])
  
  if (isLoading) {
    return <div className="text-center py-8">Loading partners...</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Accountability Partners</h1>
        <a href="/accountability/search" className="text-blue-600 hover:underline">
          Find Partners
        </a>
      </div>
      
      {partnerships.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl shadow">
          <p className="text-gray-500 mb-4">
            You don't have any accountability partners yet.
          </p>
          <a
            href="/accountability/search"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Find Partners
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Partner list sidebar */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Your Partners</h3>
            {/* TODO: Map through partnerships */}
            {/*
            {partnerships.map(partnership => (
              <button
                key={partnership.id}
                onClick={() => setSelectedPartner(partnership)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left ${
                  selectedPartner?.id === partnership.id
                    ? 'bg-blue-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  {partnership.partnerUsername.charAt(0).toUpperCase()}
                </div>
                <span>{partnership.partnerUsername}</span>
              </button>
            ))}
            */}
            <p className="text-gray-500">Partner list here</p>
          </div>
          
          {/* Partner habits view */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
            {selectedPartner ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {/* selectedPartner.partnerUsername */}'s Habits
                </h3>
                
                {/* TODO: Map through partnerHabits */}
                {/*
                {partnerHabits.map(habit => (
                  <div key={habit.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{habit.title}</h4>
                      <span className="text-orange-500 font-bold">
                        {habit.currentStreak} day streak
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{habit.category}</p>
                    
                    {/* Recent completions */}
                    <div className="flex space-x-1 mt-2">
                      {habit.recentLogs?.map((log, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded ${
                            log.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          title={log.date}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                */}
                <p className="text-gray-500">Partner's habits will appear here</p>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a partner to view their habits
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

