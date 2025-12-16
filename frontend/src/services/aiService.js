/**
 * AI Service
 * ==========
 * API calls for AI-powered features.
 */

import api from './api'

const aiService = {
  async getSuggestions(category) {
    const params = category ? { category } : {}
    return api.get('/ai/suggestions', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getWeeklySummary() {
    return api.get('/ai/weekly-summary')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getMotivation() {
    return api.get('/ai/motivation')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getPatterns() {
    return api.get('/ai/patterns')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getHabitTips(habitId) {
    return api.get(`/ai/tips/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async chat(message) {
    return api.post('/ai/chat', { message })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default aiService
