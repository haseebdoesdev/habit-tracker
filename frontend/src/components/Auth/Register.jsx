/**
 * Register Component
 * Handles new user registration
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../../services/authService'
import { SeedlingIcon } from '../Common/Icons'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      // Call registration API
      await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password_confirm: formData.confirmPassword
      })

      // Redirect to login after successful registration
      navigate('/login', {
        state: { message: 'Account created successfully! Please log in.' }
      })
    } catch (err) {
      // Handle errors - extract message from error object
      // The API interceptor sets error.message from detail/message
      const message = err.message || err.response?.data?.detail || err.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-lunar p-4">
      <div className="max-w-md w-full space-y-8 p-8 lg:p-10 card-elevated animate-fade-in">
        <div className="text-center">
          <SeedlingIcon className="w-16 h-16 mx-auto mb-4 text-solar-400" />
          <h2 className="text-3xl font-bold text-gradient-martian mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 font-medium">
            Start tracking your habits today
          </p>
        </div>

        {error && (
          <div className="bg-terracotta-600/20 text-terracotta-300 p-4 rounded-soft border border-terracotta-500/50 animate-slide-up">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <label className="block text-sm font-semibold text-lunar-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-lunar-700 mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-lunar-700 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="input"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              Minimum 8 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-lunar-700 mb-2">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Already have an account?{' '}
          <Link to="/login" className="link font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
