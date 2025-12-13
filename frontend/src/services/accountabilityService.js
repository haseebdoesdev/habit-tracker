/**
 * Accountability Service
 * ======================
 * [HASEEB] This is your service to implement.
 * 
 * API calls for accountability partner features.
 */

import api from './api'

const accountabilityService = {
  // TODO: Implement getPartnerships
  // WHY: Fetch user's partnerships
  async getPartnerships(options = {}) {
    return api.get('/accountability/partners', { params: options })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement requestPartnership
  // WHY: Send partnership request
  async requestPartnership(partnerId, message) {
    return api.post('/accountability/request', { partner_id: partnerId, message })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement respondToRequest
  // WHY: Accept or decline partnership request
  async respondToRequest(partnershipId, accept) {
    return api.post(`/accountability/${partnershipId}/respond`, { action: accept ? 'accept' : 'decline' })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement endPartnership
  // WHY: End an active partnership
  async endPartnership(partnershipId) {
    return api.delete(`/accountability/${partnershipId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement getPartnerHabits
  // WHY: View partner's habits
  async getPartnerHabits(partnerId) {
    return api.get(`/accountability/partner/${partnerId}/habits`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement addComment
  // WHY: Comment on partner's habit
  async addComment(habitId, content, logId = null) {
    return api.post('/accountability/comment', { habit_id: habitId, content, log_id: logId })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement getHabitComments
  // WHY: Get comments on a habit
  async getHabitComments(habitId) {
    return api.get(`/accountability/comments/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement searchUsers
  // WHY: Find users to partner with
  async searchUsers(query) {
    return api.get('/accountability/search', { params: { query } })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default accountabilityService

