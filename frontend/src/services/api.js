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
    // Handle 401 errors - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    // Extract error message for consistent format
    const message = error.response?.data?.detail || error.response?.data?.message || error.message
    error.message = message

    return Promise.reject(error)
  }
)

export default api
