/**
 * Form Validators
 * ===============
 * [OMAMAH] This is your utility file to implement.
 * 
 * Validation functions for forms.
 */

/**
 * Validate email format
 * 
 * TODO: Implement email validation
 * WHY: Ensure valid email before submission
 */
export function validateEmail(email) {
  // TODO: Check email format with regex
  // WHY: Basic email validation
  // APPROACH: Use standard email regex pattern
  
  // TODO: Return validation result
  // WHY: { valid: boolean, message: string }
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate password strength
 * 
 * TODO: Implement password validation
 * WHY: Ensure secure passwords
 * SECURITY: Enforce minimum requirements
 */
export function validatePassword(password) {
  // TODO: Check minimum length (8 characters)
  // WHY: Security requirement
  
  // TODO: Optionally check for complexity
  // WHY: Stronger passwords (uppercase, lowercase, number, symbol)
  
  // TODO: Return validation result with message
  // WHY: Tell user what's wrong
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate password confirmation matches
 * 
 * TODO: Implement password match validation
 * WHY: Prevent typos in password
 */
export function validatePasswordMatch(password, confirmPassword) {
  // TODO: Check if passwords match
  // WHY: Confirm user typed correctly
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate username
 * 
 * TODO: Implement username validation
 * WHY: Ensure valid username format
 */
export function validateUsername(username) {
  // TODO: Check minimum length (3 characters)
  // WHY: Readable usernames
  
  // TODO: Check maximum length
  // WHY: Reasonable limit
  
  // TODO: Check for allowed characters
  // WHY: Alphanumeric and underscores typically
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate required field
 * 
 * TODO: Implement required field validation
 * WHY: Common validation for required inputs
 */
export function validateRequired(value, fieldName = 'This field') {
  // TODO: Check if value is empty
  // WHY: Required fields can't be empty
  // Handle: null, undefined, empty string, whitespace only
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate minimum length
 * 
 * TODO: Implement min length validation
 * WHY: String length requirements
 */
export function validateMinLength(value, minLength, fieldName = 'This field') {
  // TODO: Check if value meets minimum length
  // WHY: Enforce length requirements
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate maximum length
 * 
 * TODO: Implement max length validation
 * WHY: Prevent overly long input
 */
export function validateMaxLength(value, maxLength, fieldName = 'This field') {
  // TODO: Check if value is within max length
  // WHY: Enforce length limits
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate date is in future
 * 
 * TODO: Implement future date validation
 * WHY: Goal end dates should be in future
 */
export function validateFutureDate(date) {
  // TODO: Check if date is after today
  // WHY: Past dates invalid for some uses
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate date range
 * 
 * TODO: Implement date range validation
 * WHY: End date must be after start date
 */
export function validateDateRange(startDate, endDate) {
  // TODO: Check if end is after start
  // WHY: Valid date range
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Validate positive number
 * 
 * TODO: Implement positive number validation
 * WHY: Targets, points should be positive
 */
export function validatePositiveNumber(value, fieldName = 'This field') {
  // TODO: Check if value is positive number
  // WHY: No negative values allowed
  
  return { valid: true, message: '' } // TODO: Implement
}

/**
 * Run multiple validators
 * 
 * TODO: Implement validator chain
 * WHY: Apply multiple validations to a field
 */
export function validateAll(value, validators) {
  // TODO: Run each validator
  // WHY: Check all requirements
  
  // TODO: Return first failure or success
  // WHY: Show most relevant error
  
  return { valid: true, message: '' } // TODO: Implement
}

