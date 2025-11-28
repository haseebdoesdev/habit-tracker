/**
 * Authentication Context
 * ======================
 * [HASEEB] This is your context to implement.
 * 
 * Provides authentication state throughout the app.
 */

import { createContext, useContext, useState, useEffect } from 'react'
// TODO: Import authService
// WHY: Make API calls for auth operations

// TODO: Create the context
// WHY: Share auth state across components
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // TODO: Set up auth state
  // WHY: Track current user and loading state
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // TODO: Check for existing auth on mount
    // WHY: Restore session if user was logged in
    // APPROACH: Check localStorage for token, validate it
    
    const checkAuth = async () => {
      // TODO: Get token from localStorage
      // WHY: Check for saved session
      // SECURITY: Token stored in localStorage (consider httpOnly cookies for more security)
      
      // TODO: If token exists, validate it
      // WHY: Ensure token is still valid
      // APPROACH: Call authService.getMe()
      
      // TODO: Set user if valid, clear if not
      // WHY: Update state based on validation
      
      // TODO: Set loading to false
      // WHY: Auth check complete
    }
    
    checkAuth()
  }, [])
  
  const login = async (token) => {
    // TODO: Store token in localStorage
    // WHY: Persist session across refreshes
    // APPROACH: localStorage.setItem('token', token)
    
    // TODO: Fetch user data
    // WHY: Get user profile for the token
    // APPROACH: await authService.getMe()
    
    // TODO: Update user state
    // WHY: Trigger UI updates
  }
  
  const logout = () => {
    // TODO: Remove token from localStorage
    // WHY: Clear saved session
    // APPROACH: localStorage.removeItem('token')
    
    // TODO: Clear user state
    // WHY: Update UI to logged out state
    // APPROACH: setUser(null)
    
    // TODO: Optionally call logout API
    // WHY: Invalidate token on server (if implemented)
  }
  
  const updateUser = (userData) => {
    // TODO: Update user state with new data
    // WHY: Reflect profile updates
    // APPROACH: setUser({ ...user, ...userData })
  }
  
  // TODO: Create context value object
  // WHY: Expose auth state and functions to consumers
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

// TODO: Create custom hook for using auth context
// WHY: Convenient way to access auth in components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

