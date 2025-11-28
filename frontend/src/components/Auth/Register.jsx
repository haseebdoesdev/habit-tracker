/**
 * Register Component
 * ==================
 * [HASEEB] This is your component to implement.
 * 
 * Handles new user registration.
 */

import { useState } from 'react'
// TODO: Import useNavigate from react-router-dom
// TODO: Import authService

export default function Register() {
  // TODO: Set up form state
  // WHY: Track all registration fields
  // APPROACH: useState for email, username, password, confirmPassword
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  
  // TODO: Set up error and loading state
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleChange = (e) => {
    // TODO: Update form data on input change
    // WHY: Keep form state in sync with inputs
    // APPROACH: setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Validate passwords match
    // WHY: Prevent password typos
    // APPROACH: Compare password and confirmPassword
    
    // TODO: Validate password strength
    // WHY: Security requirement
    // APPROACH: Check minimum length, maybe complexity
    
    // TODO: Set loading state
    // WHY: Show progress to user
    
    // TODO: Call registration API
    // WHY: Create account on backend
    // APPROACH: await authService.register(formData)
    
    // TODO: Handle successful registration
    // WHY: User can now log in
    // APPROACH: Redirect to login with success message
    
    // TODO: Handle errors
    // WHY: Show validation or server errors
    // APPROACH: Display error message (email taken, etc.)
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Start tracking your habits today
          </p>
        </div>
        
        {/* TODO: Display error message if exists */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TODO: Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* TODO: Username input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Choose a username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* TODO: Password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {/* TODO: Add password strength indicator */}
            {/* WHY: Help users create strong passwords */}
          </div>
          
          {/* TODO: Confirm password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* TODO: Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        {/* TODO: Link to login */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

