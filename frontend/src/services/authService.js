/**
 * Auth Service
 * ============
 * [HASEEB] implemented
 * 
 * API calls for authentication.
 */

import api from './api'

const authService = {
  async register(userData) {
    return api.post('/auth/register', userData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async login(email, password) {
    return api.post('/auth/login', { email, password })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getMe() {
    return api.get('/auth/me')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async refreshToken() {
    return api.post('/auth/refresh')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async updatePassword(currentPassword, newPassword) {
    return api.put('/auth/password', { currentPassword, newPassword })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async updateProfile(profileData) {
    return api.put('/auth/profile', profileData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default authService

