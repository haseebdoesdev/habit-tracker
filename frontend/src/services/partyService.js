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
    // TODO: Call GET /parties with options
    // WHY: Get party list
    // APPROACH: api.get('/parties', { params: options })
    
    // TODO: Return parties array
  },
  
  // TODO: Implement getParty
  // WHY: Fetch single party details
  async getParty(partyId) {
    // TODO: Call GET /parties/:id
    // WHY: Get party details
    // APPROACH: api.get(`/parties/${partyId}`)
    
    // TODO: Return party object
  },
  
  // TODO: Implement createParty
  // WHY: Create a new party
  async createParty(partyData) {
    // TODO: Call POST /parties
    // WHY: Create party on server
    // APPROACH: api.post('/parties', partyData)
    
    // TODO: Return created party
  },
  
  // TODO: Implement updateParty
  // WHY: Update party details
  async updateParty(partyId, partyData) {
    // TODO: Call PUT /parties/:id
    // WHY: Update party on server
    // APPROACH: api.put(`/parties/${partyId}`, partyData)
    
    // TODO: Return updated party
  },
  
  // TODO: Implement deleteParty
  // WHY: Delete/archive a party
  async deleteParty(partyId) {
    // TODO: Call DELETE /parties/:id
    // WHY: Remove party
    // APPROACH: api.delete(`/parties/${partyId}`)
  },
  
  // TODO: Implement joinParty
  // WHY: Join a party with invite code
  async joinParty(inviteCode) {
    // TODO: Call POST /parties/join
    // WHY: Add user to party
    // APPROACH: api.post('/parties/join', { inviteCode })
    
    // TODO: Return joined party
  },
  
  // TODO: Implement leaveParty
  // WHY: Leave a party
  async leaveParty(partyId) {
    // TODO: Call POST /parties/:id/leave
    // WHY: Remove user from party
    // APPROACH: api.post(`/parties/${partyId}/leave`)
  },
  
  // TODO: Implement getPartyMembers
  // WHY: Get list of party members
  async getPartyMembers(partyId) {
    // TODO: Call GET /parties/:id/members
    // WHY: Get member list
    // APPROACH: api.get(`/parties/${partyId}/members`)
    
    // TODO: Return members array
  },
  
  // TODO: Implement getPartyLeaderboard
  // WHY: Get global party rankings
  async getPartyLeaderboard(limit = 10) {
    // TODO: Call GET /parties/leaderboard
    // WHY: Get ranked parties
    // APPROACH: api.get('/parties/leaderboard', { params: { limit } })
    
    // TODO: Return leaderboard
  }
}

export default partyService

