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
    // TODO: Call GET /accountability/partners
    // WHY: Get partnership list
    // APPROACH: api.get('/accountability/partners', { params: options })
    
    // TODO: Return partnerships array
  },
  
  // TODO: Implement requestPartnership
  // WHY: Send partnership request
  async requestPartnership(partnerId, message) {
    // TODO: Call POST /accountability/request
    // WHY: Create partnership request
    // APPROACH: api.post('/accountability/request', { partnerId, message })
    
    // TODO: Return created request
  },
  
  // TODO: Implement respondToRequest
  // WHY: Accept or decline partnership request
  async respondToRequest(partnershipId, accept) {
    // TODO: Call POST /accountability/:id/respond
    // WHY: Accept or decline
    // APPROACH: api.post(`/accountability/${partnershipId}/respond`, { accept })
    
    // TODO: Return updated partnership
  },
  
  // TODO: Implement endPartnership
  // WHY: End an active partnership
  async endPartnership(partnershipId) {
    // TODO: Call DELETE /accountability/:id
    // WHY: End partnership
    // APPROACH: api.delete(`/accountability/${partnershipId}`)
  },
  
  // TODO: Implement getPartnerHabits
  // WHY: View partner's habits
  async getPartnerHabits(partnerId) {
    // TODO: Call GET /accountability/partner/:id/habits
    // WHY: Get partner's visible habits
    // APPROACH: api.get(`/accountability/partner/${partnerId}/habits`)
    
    // TODO: Return habits array
  },
  
  // TODO: Implement addComment
  // WHY: Comment on partner's habit
  async addComment(habitId, content, logId = null) {
    // TODO: Call POST /accountability/comment
    // WHY: Add comment
    // APPROACH: api.post('/accountability/comment', { habitId, content, logId })
    
    // TODO: Return created comment
  },
  
  // TODO: Implement getHabitComments
  // WHY: Get comments on a habit
  async getHabitComments(habitId) {
    // TODO: Call GET /accountability/comments/:habitId
    // WHY: Get comment list
    // APPROACH: api.get(`/accountability/comments/${habitId}`)
    
    // TODO: Return comments array
  },
  
  // TODO: Implement searchUsers
  // WHY: Find users to partner with
  async searchUsers(query) {
    // TODO: Call GET /accountability/search
    // WHY: Search for users
    // APPROACH: api.get('/accountability/search', { params: { query } })
    
    // TODO: Return users array
  }
}

export default accountabilityService

