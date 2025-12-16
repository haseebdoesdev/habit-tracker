/**
 * Habit Service
 * =============
 * [NOUMAN] This is your service to implement.
 * 
 * API calls for habit operations.
 */

import api from './api'

const habitService = {
  async getHabits(filters = {}) {
    return api.get('/habits/', { params: filters })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async getHabit(habitId) {
    return api.get(`/habits/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async createHabit(habitData) {
    return api.post('/habits/', habitData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async updateHabit(habitId, habitData) {
    return api.put(`/habits/${habitId}`, habitData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async deleteHabit(habitId) {
    return api.delete(`/habits/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async completeHabit(habitId) {
    return api.post(`/habits/${habitId}/complete`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async getHabitStats(habitId) {
    return api.get(`/habits/${habitId}/stats`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async logCompletion(habitId, logData) {
    return api.post('/logs', { habit_id: habitId, ...logData })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default habitService

