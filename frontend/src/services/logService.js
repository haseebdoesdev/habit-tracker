/**
 * Log Service
 * ============
 * API calls for habit log/completion operations.
 */

import api from './api'

const logService = {
  /**
   * Create a new log entry
   */
  async createLog(logData) {
    // Ensure snake_case for backend
    const requestData = {
      habit_id: logData.habitId,
      log_date: logData.logDate || null, // ISO date string (YYYY-MM-DD)
      completed: logData.completed !== undefined ? logData.completed : true,
      notes: logData.notes || null,
      mood: logData.mood || null, // 1-5 scale
      duration_minutes: logData.durationMinutes || null
    }
    
    return api.post('/logs/', requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Get a specific log entry
   */
  async getLog(logId) {
    return api.get(`/logs/${logId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Update a log entry
   */
  async updateLog(logId, logData) {
    const requestData = {}
    if (logData.completed !== undefined) requestData.completed = logData.completed
    if (logData.notes !== undefined) requestData.notes = logData.notes
    if (logData.mood !== undefined) requestData.mood = logData.mood // 1-5 scale
    if (logData.durationMinutes !== undefined) requestData.duration_minutes = logData.durationMinutes
    
    return api.put(`/logs/${logId}`, requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Delete a log entry
   */
  async deleteLog(logId) {
    return api.delete(`/logs/${logId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Get logs for a specific habit
   */
  async getHabitLogs(habitId, startDate = null, endDate = null) {
    const params = {}
    if (startDate) params.start_date = startDate // ISO date string
    if (endDate) params.end_date = endDate // ISO date string
    
    return api.get(`/logs/habit/${habitId}`, { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Get daily log summary for a specific date
   */
  async getDailySummary(logDate) {
    // logDate should be ISO date string (YYYY-MM-DD)
    return api.get(`/logs/daily/${logDate}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Get weekly log summary
   */
  async getWeeklySummary(weekStart = null) {
    const params = {}
    if (weekStart) params.week_start = weekStart // ISO date string
    
    return api.get('/logs/weekly', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Analyze mood from log notes using AI
   */
  async analyzeMood(logId) {
    return api.post(`/logs/${logId}/analyze-mood`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Get mood insights
   */
  async getMoodInsights(startDate = null, endDate = null) {
    const params = {}
    if (startDate) params.start_date = startDate // ISO date string
    if (endDate) params.end_date = endDate // ISO date string
    
    return api.get('/logs/mood-insights', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default logService



