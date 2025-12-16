/**
 * API Service Base
 * Axios instance configured for API calls
 */

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 errors - redirect to login (except for login/register endpoints)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ''
      // Don't redirect if we're already on login/register page or refreshing token
      const isAuthEndpoint = 
        requestUrl.includes('/auth/login') || 
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/refresh')
      
      if (!isAuthEndpoint) {
        localStorage.removeItem('token')
        // Only redirect if not already on login page to prevent refresh loops
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login'
        }
      }
    }

    // Extract error message for consistent format
    const message = error.response?.data?.detail || error.response?.data?.message || error.message
    error.message = message

    return Promise.reject(error)
  }
)

export default api
