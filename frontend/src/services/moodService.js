/**
 * Mood Service
 * ============
 * API calls for mood analysis and insights.
 */

import api from './api'

const moodService = {
  async analyzeLogMood(logId) {
    return api.post(`/logs/${logId}/analyze-mood`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  async getMoodInsights(startDate = null, endDate = null) {
    const params = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    return api.get('/logs/mood-insights', { params })
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default moodService






