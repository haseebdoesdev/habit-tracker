/**
 * Party Goal Service
 * ===================
 * [NOUMAN] This is your service to implement.
 * 
 * API calls for party goal operations.
 */

import api from './api'

const partyGoalService = {
  // Create a new party goal
  async createGoal(partyId, goalData) {
    // Convert frontend camelCase to backend snake_case
    const requestData = {
      party_id: partyId,
      title: goalData.title,
      description: goalData.description || null,
      target_value: goalData.targetValue,
      start_date: goalData.startDate || null,
      end_date: goalData.endDate || null,
      reward_points: goalData.rewardPoints || 0,
      habit_category: goalData.habitCategory || null
    }
    
    return api.post('/party-goals/', requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Get goals for a party
  async getPartyGoals(partyId, filter = 'all') {
    const params = {}
    
    // Convert frontend filter to backend status_filter
    if (filter && filter !== 'all') {
      // Convert 'active' -> 'ACTIVE', 'completed' -> 'COMPLETED'
      params.status_filter = filter.toUpperCase()
    }
    
    return api.get(`/party-goals/party/${partyId}`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Get a specific goal
  async getGoal(goalId) {
    return api.get(`/party-goals/${goalId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Update a goal
  async updateGoal(goalId, goalData) {
    // Convert frontend camelCase to backend snake_case
    const requestData = {}
    if (goalData.title !== undefined) requestData.title = goalData.title
    if (goalData.description !== undefined) requestData.description = goalData.description
    if (goalData.targetValue !== undefined) requestData.target_value = goalData.targetValue
    if (goalData.endDate !== undefined) requestData.end_date = goalData.endDate
    if (goalData.status !== undefined) requestData.status = goalData.status
    
    return api.put(`/party-goals/${goalId}`, requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Delete a goal
  async deleteGoal(goalId) {
    return api.delete(`/party-goals/${goalId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Contribute to a goal
  async contribute(goalId, increment = 1) {
    return api.post(`/party-goals/${goalId}/contribute`, { increment })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  // Get contributors for a goal
  async getContributors(goalId) {
    return api.get(`/party-goals/${goalId}/contributors`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default partyGoalService











