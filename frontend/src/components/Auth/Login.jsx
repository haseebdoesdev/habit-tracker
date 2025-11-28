/**
 * Login Component
 * ===============
 * [HASEEB] This is your component to implement.
 * 
 * Handles user login form and authentication.
 */

import { useState } from 'react'
// TODO: Import useNavigate from react-router-dom
// WHY: Redirect after successful login

// TODO: Import useAuth context hook
// WHY: Access login function and auth state

// TODO: Import authService for API calls
// WHY: Make login request to backend

export default function Login() {
  // TODO: Set up form state for email and password
  // WHY: Track user input
  // APPROACH: useState for each field or useForm hook
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // TODO: Set up error and loading state
  // WHY: Show feedback to user
  // APPROACH: useState for error message and isLoading boolean
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // TODO: Get login function from auth context
  // WHY: Update global auth state after login
  // APPROACH: const { login } = useAuth()
  
  // TODO: Get navigate function
  // WHY: Redirect after login
  // APPROACH: const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Clear previous errors
    // WHY: Start fresh on new attempt
    
    // TODO: Validate form inputs
    // WHY: Check email and password are provided
    // APPROACH: Basic validation before API call
    
    // TODO: Set loading state
    // WHY: Show loading indicator
    
    // TODO: Call login API
    // WHY: Authenticate with backend
    // APPROACH: await authService.login(email, password)
    // SECURITY: Use HTTPS, credentials are sent securely
    
    // TODO: Handle successful login
    // WHY: Store token and update auth state
    // APPROACH: Call context's login function with token
    
    // TODO: Redirect to dashboard
    // WHY: User is now logged in
    // APPROACH: navigate('/') or navigate('/dashboard')
    
    // TODO: Handle errors
    // WHY: Show user what went wrong
    // APPROACH: Set error state with message
    // SECURITY: Don't reveal if email exists
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {/* TODO: Display error message if exists */}
        {/* WHY: User feedback on failed login */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TODO: Email input field */}
          {/* WHY: User enters their email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            {/* TODO: Add input with value={email} onChange handler */}
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* TODO: Password input field */}
          {/* WHY: User enters their password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            {/* TODO: Add input with value={password} onChange handler */}
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* TODO: Submit button with loading state */}
          {/* WHY: Trigger login and show progress */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        {/* TODO: Link to registration page */}
        {/* WHY: New users need to register */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          {/* TODO: Add Link to /register */}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

