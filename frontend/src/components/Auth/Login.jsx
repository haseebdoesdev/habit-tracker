/**
 * Login Component
 * Handles user login form and authentication
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { MoonIcon } from '../Common/Icons'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      // Call login API
      const response = await authService.login(email, password)

      // Store token and update auth state
      // Backend returns { access_token: "...", token_type: "Bearer" }
      await login(response.access_token)

      // Redirect to dashboard
      navigate('/')
    } catch (err) {
      // Handle errors - extract message from error object
      // The API interceptor sets error.message from detail/message
      const message = err.message || err.response?.data?.detail || err.response?.data?.message || 'Invalid email or password'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-lunar p-4">
      <div className="max-w-md w-full space-y-8 p-8 lg:p-10 card-elevated animate-fade-in">
        <div className="text-center">
          <MoonIcon className="w-16 h-16 mx-auto mb-4 text-accent-400" />
          <h2 className="text-3xl font-bold text-gradient-martian mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 font-medium">
            Sign in to your account
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
            <label htmlFor="email" className="block text-sm font-semibold text-lunar-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-lunar-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Don't have an account?{' '}
          <Link to="/register" className="link font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
