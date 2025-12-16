/**
 * Accountability Service
 * ======================
 * [HASEEB] This is your service to implement.
 * 
 * API calls for accountability partner features.
 */

import api from './api'

const accountabilityService = {
  async getPartnerships(options = {}) {
    return api.get('/accountability/partners', { params: options })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async requestPartnership(partnerId, message) {
    return api.post('/accountability/request', { partner_id: partnerId, message })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async respondToRequest(partnershipId, accept) {
    return api.post(`/accountability/${partnershipId}/respond`, { action: accept ? 'accept' : 'decline' })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async endPartnership(partnershipId) {
    return api.delete(`/accountability/${partnershipId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async getPartnerHabits(partnerId) {
    return api.get(`/accountability/partner/${partnerId}/habits`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async addComment(habitId, content, logId = null) {
    return api.post('/accountability/comment', { habit_id: habitId, content, log_id: logId })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async getHabitComments(habitId) {
    return api.get(`/accountability/comments/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async searchUsers(query) {
    return api.get('/accountability/search', { params: { query } })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default accountabilityService

