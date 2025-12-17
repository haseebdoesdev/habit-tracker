/**
 * Form Validators
 * ===============
 * [OMAMAH] This is your utility file to implement.
 * 
 * Validation functions for forms.
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' }
  }
  
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' }
  }
  
  // Minimum length check (8 characters as per backend)
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  
  // Optional complexity check (can be enhanced)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
  const complexityCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length
  
  if (complexityCount < 2) {
    return { 
      valid: false, 
      message: 'Password should contain at least 2 of: uppercase, lowercase, number, or special character' 
    }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate password confirmation matches
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!password || !confirmPassword) {
    return { valid: false, message: 'Both password fields are required' }
  }
  
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate username
 */
export function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Username is required' }
  }
  
  // Check minimum length (3 characters as per backend)
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' }
  }
  
  // Check maximum length (20 characters as per backend)
  if (username.length > 20) {
    return { valid: false, message: 'Username must be no more than 20 characters long' }
  }
  
  // Check for allowed characters (alphanumeric and underscores)
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate required field
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined) {
    return { valid: false, message: `${fieldName} is required` }
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, message: `${fieldName} is required` }
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, message: `${fieldName} is required` }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate minimum length
 */
export function validateMinLength(value, minLength, fieldName = 'This field') {
  if (value === null || value === undefined) {
    return { valid: false, message: `${fieldName} is required` }
  }
  
  const stringValue = String(value)
  
  if (stringValue.length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters long` }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value, maxLength, fieldName = 'This field') {
  if (value === null || value === undefined) {
    return { valid: true, message: '' }
  }
  
  const stringValue = String(value)
  
  if (stringValue.length > maxLength) {
    return { valid: false, message: `${fieldName} must be no more than ${maxLength} characters long` }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate date is in future
 */
export function validateFutureDate(date) {
  if (!date) {
    return { valid: false, message: 'Date is required' }
  }
  
  const dateObj = date instanceof Date ? date : new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dateObj.setHours(0, 0, 0, 0)
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, message: 'Invalid date format' }
  }
  
  if (dateObj <= today) {
    return { valid: false, message: 'Date must be in the future' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate date range
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return { valid: false, message: 'Both start and end dates are required' }
  }
  
  const start = startDate instanceof Date ? startDate : new Date(startDate)
  const end = endDate instanceof Date ? endDate : new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: 'Invalid date format' }
  }
  
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  
  if (end <= start) {
    return { valid: false, message: 'End date must be after start date' }
  }
  
  return { valid: true, message: '' }
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value, fieldName = 'This field') {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: `${fieldName} is required` }
  }
  
  const numValue = Number(value)
  
  if (isNaN(numValue)) {
    return { valid: false, message: `${fieldName} must be a valid number` }
  }
  
  if (numValue <= 0) {
    return { valid: false, message: `${fieldName} must be a positive number` }
  }
  
  return { valid: true, message: '' }
}

/**
 * Run multiple validators
 */
export function validateAll(value, validators) {
  if (!Array.isArray(validators) || validators.length === 0) {
    return { valid: true, message: '' }
  }
  
  for (const validator of validators) {
    if (typeof validator !== 'function') {
      continue
    }
    
    const result = validator(value)
    
    if (!result.valid) {
      return result
    }
  }
  
  return { valid: true, message: '' }
}

