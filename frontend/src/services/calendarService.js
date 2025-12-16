/**
 * Calendar Service
 * ================
 * API calls for Google Calendar integration.
 */

import api from './api'

const calendarService = {
  /**
   * Get Google OAuth authorization URL
   */
  async getOAuthUrl() {
    return api.get('/calendar/oauth/url')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Check calendar connection status
   */
  async getStatus() {
    return api.get('/calendar/status')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Sync all habits to Google Calendar
   */
  async syncHabits() {
    return api.post('/calendar/sync')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Create calendar event for a habit
   */
  async createEvent(habitId, eventData) {
    const requestData = {
      reminder_time: eventData.reminderTime, // HH:MM format
      recurrence: eventData.recurrence || 'daily', // daily, weekly, custom
      custom_days: eventData.customDays || null // For weekly: ["MO", "TU", "WE"]
    }
    
    return api.post(`/calendar/event/${habitId}`, requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Update calendar event for a habit
   */
  async updateEvent(habitId, eventData) {
    const requestData = {}
    if (eventData.reminderTime !== undefined) requestData.reminder_time = eventData.reminderTime
    if (eventData.recurrence !== undefined) requestData.recurrence = eventData.recurrence
    if (eventData.customDays !== undefined) requestData.custom_days = eventData.customDays
    
    return api.put(`/calendar/event/${habitId}`, requestData)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Delete calendar event for a habit
   */
  async deleteEvent(habitId) {
    return api.delete(`/calendar/event/${habitId}`)
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  },

  /**
   * Disconnect Google Calendar
   */
  async disconnect() {
    return api.delete('/calendar/disconnect')
      .then(response => response.data)
      .catch(error => {
        throw error
      })
  }
}

export default calendarService



