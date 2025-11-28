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
    // TODO: Build query params from filters
    // WHY: Apply category, status filters
    // APPROACH: api.get('/habits', { params: filters })
    
    // TODO: Return habits array
    // WHY: Display in UI
  },
  
  // TODO: Implement getHabit
  // WHY: Fetch single habit by ID
  async getHabit(habitId) {
    // TODO: Call GET /habits/:id
    // WHY: Get habit details
    // APPROACH: api.get(`/habits/${habitId}`)
    
    // TODO: Return habit object
    // WHY: Display details or edit
  },
  
  // TODO: Implement createHabit
  // WHY: Create a new habit
  async createHabit(habitData) {
    // TODO: Call POST /habits
    // WHY: Create habit on server
    // APPROACH: api.post('/habits', habitData)
    
    // TODO: Return created habit
    // WHY: Add to local state, get ID
  },
  
  // TODO: Implement updateHabit
  // WHY: Update an existing habit
  async updateHabit(habitId, habitData) {
    // TODO: Call PUT /habits/:id
    // WHY: Update habit on server
    // APPROACH: api.put(`/habits/${habitId}`, habitData)
    
    // TODO: Return updated habit
    // WHY: Update local state
  },
  
  // TODO: Implement deleteHabit
  // WHY: Delete a habit
  async deleteHabit(habitId) {
    // TODO: Call DELETE /habits/:id
    // WHY: Remove habit from server
    // APPROACH: api.delete(`/habits/${habitId}`)
  },
  
  // TODO: Implement completeHabit
  // WHY: Quick completion for today
  async completeHabit(habitId) {
    // TODO: Call POST /habits/:id/complete
    // WHY: Mark habit done for today
    // APPROACH: api.post(`/habits/${habitId}/complete`)
    
    // TODO: Return updated habit
    // WHY: Update UI with new state
  },
  
  // TODO: Implement getHabitStats
  // WHY: Get statistics for a habit
  async getHabitStats(habitId) {
    // TODO: Call GET /habits/:id/stats
    // WHY: Get streak, completion rate, etc.
    // APPROACH: api.get(`/habits/${habitId}/stats`)
    
    // TODO: Return stats object
    // WHY: Display analytics
  },
  
  // TODO: Implement logCompletion
  // WHY: Log habit completion for specific date
  async logCompletion(habitId, logData) {
    // TODO: Call POST /logs
    // WHY: Create log entry
    // APPROACH: api.post('/logs', { habitId, ...logData })
    
    // TODO: Return created log
    // WHY: Update local state
  }
}

export default habitService

