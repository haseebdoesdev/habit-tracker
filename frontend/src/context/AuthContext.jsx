/**
 * Authentication Context
 * Provides authentication state throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth session on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const user = await authService.getMe()
          setUser(user)
        } catch (error) {
          console.error('Failed to validate token:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (token) => {
    try {
      localStorage.setItem('token', token)
      const user = await authService.getMe()
      setUser(user)
    } catch (error) {
      localStorage.removeItem('token')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser({ ...user, ...userData })
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to access auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
