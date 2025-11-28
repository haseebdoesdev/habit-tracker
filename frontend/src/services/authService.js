/**
 * Auth Service
 * ============
 * [HASEEB] This is your service to implement.
 * 
 * API calls for authentication.
 */

import api from './api'

const authService = {
  // TODO: Implement register
  // WHY: Create new user account
  async register(userData) {
    // TODO: Call POST /auth/register
    // WHY: Send registration data to backend
    // APPROACH: api.post('/auth/register', userData)
    
    // TODO: Return response
    // WHY: Caller handles success/error
  },
  
  // TODO: Implement login
  // WHY: Authenticate user and get token
  async login(email, password) {
    // TODO: Call POST /auth/login
    // WHY: Send credentials to backend
    // APPROACH: api.post('/auth/login', { email, password })
    
    // TODO: Return token from response
    // WHY: Caller stores token
  },
  
  // TODO: Implement getMe
  // WHY: Get current user profile
  async getMe() {
    // TODO: Call GET /auth/me
    // WHY: Fetch authenticated user's profile
    // APPROACH: api.get('/auth/me')
    
    // TODO: Return user data
    // WHY: Update auth context
  },
  
  // TODO: Implement refreshToken
  // WHY: Get new token before expiry
  async refreshToken() {
    // TODO: Call POST /auth/refresh
    // WHY: Get fresh token
    // APPROACH: api.post('/auth/refresh')
    
    // TODO: Return new token
    // WHY: Replace old token
  },
  
  // TODO: Implement updatePassword
  // WHY: Allow password change
  async updatePassword(currentPassword, newPassword) {
    // TODO: Call PUT /auth/password
    // WHY: Update password on server
    // APPROACH: api.put('/auth/password', { currentPassword, newPassword })
  },
  
  // TODO: Implement updateProfile
  // WHY: Update user profile
  async updateProfile(profileData) {
    // TODO: Call PUT /auth/profile
    // WHY: Update profile on server
    // APPROACH: api.put('/auth/profile', profileData)
    
    // TODO: Return updated user
    // WHY: Update auth context
  }
}

export default authService

