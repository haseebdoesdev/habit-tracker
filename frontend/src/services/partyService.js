/**
 * Party Service
 * =============
 * [OMAMAH] This is your service to implement.
 * 
 * API calls for party/guild operations.
 */

import api from './api'

const partyService = {
  // TODO: Implement getParties
  // WHY: Fetch parties (user's or public)
  async getParties(options = {}) {
    return api.get('/parties', { params: options })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement getParty
  // WHY: Fetch single party details
  async getParty(partyId) {
    return api.get(`/parties/${partyId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement createParty
  // WHY: Create a new party
  async createParty(partyData) {
    return api.post('/parties', partyData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement updateParty
  // WHY: Update party details
  async updateParty(partyId, partyData) {
    return api.put(`/parties/${partyId}`, partyData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement deleteParty
  // WHY: Delete/archive a party
  async deleteParty(partyId) {
    return api.delete(`/parties/${partyId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement joinParty
  // WHY: Join a party with invite code
  async joinParty(inviteCode) {
    return api.post('/parties/join', { invite_code: inviteCode })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement leaveParty
  // WHY: Leave a party
  async leaveParty(partyId) {
    return api.post(`/parties/${partyId}/leave`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement getPartyMembers
  // WHY: Get list of party members
  async getPartyMembers(partyId) {
    return api.get(`/parties/${partyId}/members`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // TODO: Implement getPartyLeaderboard
  // WHY: Get global party rankings
  async getPartyLeaderboard(limit = 10) {
    return api.get('/parties/leaderboard', { params: { limit } })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default partyService
