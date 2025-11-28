/**
 * API Service Base
 * ================
 * [OMAMAH] This is your service to implement.
 * 
 * Axios instance configured for API calls.
 */

import axios from 'axios'

// TODO: Create axios instance with base configuration
// WHY: Centralized API configuration
// APPROACH: axios.create with baseURL and defaults

const api = axios.create({
  // TODO: Set base URL
  // WHY: All API calls go to same server
  // APPROACH: Use environment variable or default to /api
  baseURL: '/api',
  
  // TODO: Set default headers
  // WHY: Common headers for all requests
  headers: {
    'Content-Type': 'application/json'
  }
})

// TODO: Add request interceptor for auth token
// WHY: Automatically include token in requests
// SECURITY: Token added to every authenticated request
/*
api.interceptors.request.use(
  (config) => {
    // TODO: Get token from localStorage
    // WHY: Add auth header if token exists
    const token = localStorage.getItem('token')
    
    if (token) {
      // TODO: Add Authorization header
      // WHY: Server needs token for auth
      // APPROACH: config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
*/

// TODO: Add response interceptor for error handling
// WHY: Centralized error handling
/*
api.interceptors.response.use(
  (response) => {
    // TODO: Return response data
    // WHY: Unwrap axios response
    return response.data
  },
  (error) => {
    // TODO: Handle 401 errors
    // WHY: Redirect to login if token invalid
    // APPROACH: Clear token, redirect to /login
    
    if (error.response?.status === 401) {
      // TODO: Clear auth and redirect
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }
    
    // TODO: Extract error message
    // WHY: Consistent error format
    const message = error.response?.data?.detail || error.message
    
    return Promise.reject(new Error(message))
  }
)
*/

export default api

