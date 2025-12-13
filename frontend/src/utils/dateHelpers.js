/**
 * Date Helper Utilities
 * =====================
 * [NOUMAN] This is your utility file to implement.
 * 
 * Helper functions for date manipulation and formatting.
 */

/**
 * Convert input to Date object (handles both Date objects and ISO strings)
 */
function toDate(date) {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === 'string') {
    return new Date(date)
  }
  throw new Error('Invalid date input')
}

/**
 * Format a date for display
 * 
 * TODO: Implement date formatting
 * WHY: Consistent date display across app
 * APPROACH: Use Intl.DateTimeFormat or format manually
 */
export function formatDate(date, format = 'short') {
  const dateObj = toDate(date)
  
  if (format === 'iso') {
    return dateObj.toISOString().split('T')[0]
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  // Default: 'short' format (Jan 1, 2024)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Format a time for display
 * 
 * TODO: Implement time formatting
 * WHY: Show times in user-friendly format
 */
export function formatTime(date) {
  const dateObj = toDate(date)
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Get relative time (e.g., "2 hours ago")
 * 
 * TODO: Implement relative time
 * WHY: More intuitive for recent dates
 */
export function getRelativeTime(date) {
  const dateObj = toDate(date)
  const now = new Date()
  const diffMs = now - dateObj
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) {
    return 'just now'
  }
  
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  }
  
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  }
  
  if (diffDays === 1) {
    return 'yesterday'
  }
  
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
  }
  
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  }
  
  const years = Math.floor(diffDays / 365)
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

/**
 * Check if date is today
 * 
 * TODO: Implement today check
 * WHY: Common condition for habit tracking
 */
export function isToday(date) {
  const dateObj = toDate(date)
  const today = new Date()
  return isSameDay(dateObj, today)
}

/**
 * Check if date is yesterday
 * 
 * TODO: Implement yesterday check
 * WHY: Streak calculations
 */
export function isYesterday(date) {
  const dateObj = toDate(date)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(dateObj, yesterday)
}

/**
 * Get start of week
 * 
 * TODO: Implement week start
 * WHY: Weekly analytics
 */
export function getStartOfWeek(date = new Date()) {
  const dateObj = toDate(date)
  const day = dateObj.getDay()
  // Convert Sunday (0) to 7, then calculate days to subtract
  // Monday is start of week (based on backend implementation)
  const daysToMonday = day === 0 ? 6 : day - 1
  const startOfWeek = new Date(dateObj)
  startOfWeek.setDate(dateObj.getDate() - daysToMonday)
  startOfWeek.setHours(0, 0, 0, 0)
  return startOfWeek
}

/**
 * Get end of week
 * 
 * TODO: Implement week end
 * WHY: Weekly analytics
 */
export function getEndOfWeek(date = new Date()) {
  const startOfWeek = getStartOfWeek(date)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return endOfWeek
}

/**
 * Get date range for last N days
 * 
 * TODO: Implement date range
 * WHY: Charts and analytics
 */
export function getLastNDays(n) {
  const dates = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date)
  }
  
  return dates
}

/**
 * Format date for API
 * 
 * TODO: Implement API date format
 * WHY: Backend expects specific format
 */
export function toAPIDate(date) {
  const dateObj = toDate(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse date from API
 * 
 * TODO: Implement API date parsing
 * WHY: Convert API dates to Date objects
 */
export function fromAPIDate(dateString) {
  // Handle both date-only strings (YYYY-MM-DD) and ISO datetime strings
  if (typeof dateString === 'string') {
    // If it's just a date string (YYYY-MM-DD), append time to avoid timezone issues
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(dateString + 'T00:00:00')
    }
    return new Date(dateString)
  }
  return new Date(dateString)
}

/**
 * Get day of week name
 * 
 * TODO: Implement day name
 * WHY: Display in UI
 */
export function getDayName(date, format = 'long') {
  const dateObj = toDate(date)
  const dayNames = {
    long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
  const dayIndex = dateObj.getDay()
  return format === 'short' ? dayNames.short[dayIndex] : dayNames.long[dayIndex]
}

/**
 * Check if two dates are the same day
 * 
 * TODO: Implement same day check
 * WHY: Date comparisons
 */
export function isSameDay(date1, date2) {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

