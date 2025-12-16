/**
 * Auth Service
 * ============
 * [HASEEB] implemented
 * 
 * API calls for authentication.
 */

import api from './api'

const authService = {
  // TODO: Implement register
  // WHY: Create new user account
  async register(userData) {
    return api.post('/auth/register', userData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement login
  // WHY: Authenticate user and get token
  async login(email, password) {
    return api.post('/auth/login', { email, password })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement getMe
  // WHY: Get current user profile
  async getMe() {
    return api.get('/auth/me')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement refreshToken
  // WHY: Get new token before expiry
  async refreshToken() {
    return api.post('/auth/refresh')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement updatePassword
  // WHY: Allow password change
  async updatePassword(currentPassword, newPassword) {
    return api.put('/auth/password', { currentPassword, newPassword })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement updateProfile
  // WHY: Update user profile
  async updateProfile(profileData) {
    return api.put('/auth/profile', profileData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default authService

