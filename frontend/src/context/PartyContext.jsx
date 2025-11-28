/**
 * Party Context
 * =============
 * [NOUMAN] This is your context to implement.
 * 
 * Provides party state for guild/party features.
 */

import { createContext, useContext, useState, useEffect } from 'react'
// TODO: Import partyService
// TODO: Import useAuth hook

const PartyContext = createContext(null)

export function PartyProvider({ children }) {
  // TODO: Set up party state
  // WHY: Track user's parties and current party
  const [myParties, setMyParties] = useState([])
  const [currentParty, setCurrentParty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // TODO: Get auth state
  // WHY: Only fetch parties if logged in
  // const { user } = useAuth()
  
  useEffect(() => {
    // TODO: Fetch user's parties when logged in
    // WHY: Load party data on auth
    // APPROACH: if (user) fetchMyParties()
    
    const fetchMyParties = async () => {
      // TODO: Call party service
      // WHY: Get user's party list
      // APPROACH: await partyService.getParties()
      
      // TODO: Update state
      // WHY: Store fetched parties
    }
    
    // if (user) fetchMyParties()
  }, [])
  
  const selectParty = async (partyId) => {
    // TODO: Set current party
    // WHY: User selected a party to view
    // APPROACH: Find party in myParties or fetch from API
  }
  
  const joinParty = async (inviteCode) => {
    // TODO: Call join API
    // WHY: Join a party with invite code
    // APPROACH: await partyService.joinParty(inviteCode)
    
    // TODO: Add to myParties
    // WHY: Update local state
    
    // TODO: Return joined party
    // WHY: Allow navigation to party
  }
  
  const leaveParty = async (partyId) => {
    // TODO: Call leave API
    // WHY: Leave a party
    // APPROACH: await partyService.leaveParty(partyId)
    
    // TODO: Remove from myParties
    // WHY: Update local state
    
    // TODO: Clear currentParty if it was the left party
    // WHY: No longer a member
  }
  
  const refreshParties = async () => {
    // TODO: Refetch user's parties
    // WHY: Sync with server state
    // APPROACH: Call API and update myParties
  }
  
  const value = {
    myParties,
    currentParty,
    isLoading,
    selectParty,
    joinParty,
    leaveParty,
    refreshParties
  }
  
  return (
    <PartyContext.Provider value={value}>
      {children}
    </PartyContext.Provider>
  )
}

export function useParty() {
  const context = useContext(PartyContext)
  if (!context) {
    throw new Error('useParty must be used within a PartyProvider')
  }
  return context
}

