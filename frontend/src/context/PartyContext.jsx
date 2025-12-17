/**
 * Party Context
 * =============
 * Provides party state for guild/party features.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import partyService from '../services/partyService'
import { useAuth } from './AuthContext'

const PartyContext = createContext(null)

export function PartyProvider({ children }) {
  const [myParties, setMyParties] = useState([])
  const [currentParty, setCurrentParty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { user } = useAuth()
  
  const refreshParties = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch parties the user is a member of
      const parties = await partyService.getParties()
      setMyParties(parties)
    } catch (err) {
      console.error("Failed to fetch parties", err)
      setError("Could not load your parties.")
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Fetch parties when user logs in
  useEffect(() => {
    if (user) {
      refreshParties()
    } else {
      setMyParties([])
      setCurrentParty(null)
    }
  }, [user, refreshParties])
  
  const selectParty = async (partyId) => {
    setIsLoading(true)
    try {
      const party = await partyService.getParty(partyId)
      setCurrentParty(party)
      return party
    } catch (err) {
      console.error("Failed to select party", err)
      setError("Could not load party details.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const joinParty = async (inviteCode) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await partyService.joinParty(inviteCode)
      await refreshParties() // Refresh list to include new party
      return response
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to join party"
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  const leaveParty = async (partyId) => {
    setIsLoading(true)
    try {
      await partyService.leaveParty(partyId)
      
      // Update local state
      setMyParties(prev => prev.filter(p => p.id !== partyId))
      
      // If we are viewing the party we just left, clear it
      if (currentParty && currentParty.id === partyId) {
        setCurrentParty(null)
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to leave party"
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  const value = {
    myParties,
    currentParty,
    isLoading,
    error,
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

