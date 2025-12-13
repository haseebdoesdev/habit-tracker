/**
 * Habit Service
 * =============
 * [NOUMAN] This is your service to implement.
 * 
 * API calls for habit operations.
 */

import api from './api'

const habitService = {
  // TODO: Implement getHabits
  // WHY: Fetch user's habits with optional filters
  async getHabits(filters = {}) {
    return api.get('/habits', { params: filters })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement getHabit
  // WHY: Fetch single habit by ID
  async getHabit(habitId) {
    return api.get(`/habits/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement createHabit
  // WHY: Create a new habit
  async createHabit(habitData) {
    return api.post('/habits', habitData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement updateHabit
  // WHY: Update an existing habit
  async updateHabit(habitId, habitData) {
    return api.put(`/habits/${habitId}`, habitData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement deleteHabit
  // WHY: Delete a habit
  async deleteHabit(habitId) {
    return api.delete(`/habits/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement completeHabit
  // WHY: Quick completion for today
  async completeHabit(habitId) {
    return api.post(`/habits/${habitId}/complete`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement getHabitStats
  // WHY: Get statistics for a habit
  async getHabitStats(habitId) {
    return api.get(`/habits/${habitId}/stats`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  // TODO: Implement logCompletion
  // WHY: Log habit completion for specific date
  async logCompletion(habitId, logData) {
    return api.post('/logs', { habit_id: habitId, ...logData })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default habitService

