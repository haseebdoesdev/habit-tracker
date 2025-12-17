/**
 * Party Service
 * =============
 * [OMAMAH] This is your service to implement.
 * 
 * API calls for party/guild operations.
 */

import api from './api'

const partyService = {
  async getParties(options = {}) {
    return api.get('/parties/', { params: options })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getParty(partyId) {
    return api.get(`/parties/${partyId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async createParty(partyData) {
    return api.post('/parties/', partyData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async updateParty(partyId, partyData) {
    return api.put(`/parties/${partyId}`, partyData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async deleteParty(partyId) {
    return api.delete(`/parties/${partyId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async joinParty(inviteCode) {
    return api.post('/parties/join', { invite_code: inviteCode })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async leaveParty(partyId) {
    return api.post(`/parties/${partyId}/leave`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getPartyMembers(partyId) {
    return api.get(`/parties/${partyId}/members`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getPartyLeaderboard(limit = 10) {
    return api.get('/parties/leaderboard', { params: { limit } })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default partyService
