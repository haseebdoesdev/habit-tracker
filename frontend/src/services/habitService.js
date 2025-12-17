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
    // Convert camelCase to snake_case for backend compatibility
    // Also convert empty strings to null for optional fields
    const reminderTime = habitData.reminderTime || habitData.reminder_time
    const requestData = {
      ...habitData,
      reminder_time: reminderTime && reminderTime.trim() ? reminderTime.trim() : null,
      target_days: (habitData.targetDays || habitData.target_days) || null,
      party_id: (habitData.partyId || habitData.party_id) || null,
      is_active: habitData.isActive !== undefined ? habitData.isActive : (habitData.is_active !== undefined ? habitData.is_active : true)
    }
    // Remove camelCase versions
    delete requestData.reminderTime
    delete requestData.targetDays
    delete requestData.partyId
    delete requestData.isActive
    
    return api.post('/habits/', requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },
  
  async updateHabit(habitId, habitData) {
    // Convert camelCase to snake_case for backend compatibility
    // Also convert empty strings to null for optional fields
    const reminderTime = habitData.reminderTime !== undefined ? habitData.reminderTime : habitData.reminder_time
    const requestData = {
      ...habitData,
      reminder_time: reminderTime !== undefined ? (reminderTime && reminderTime.trim() ? reminderTime.trim() : null) : undefined,
      target_days: habitData.targetDays !== undefined ? habitData.targetDays : habitData.target_days,
      party_id: habitData.partyId !== undefined ? habitData.partyId : habitData.party_id,
      is_active: habitData.isActive !== undefined ? habitData.isActive : habitData.is_active
    }
    // Remove camelCase versions
    delete requestData.reminderTime
    delete requestData.targetDays
    delete requestData.partyId
    delete requestData.isActive
    
    return api.put(`/habits/${habitId}`, requestData)
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

