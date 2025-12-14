/**
 * Navbar Component
 * ================
 * Top navigation bar handling authentication state and routing.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <nav className="bg-white shadow z-50 relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🎯</span>
            <span className="text-xl font-bold text-gray-900">
              Habit<span className="text-blue-600">Tracker</span>
            </span>
          </Link>          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* desktop nav links - Hidden on mobile if i would add mobile menu later */}
                <div className="hidden md:flex items-center space-x-6 mr-4">
                  <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/habits" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Habits
                  </Link>
                  <Link to="/analytics" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Analytics
                  </Link>
                  <Link to="/parties" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Parties
                  </Link>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username} 
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-900 font-medium hidden sm:block">
                      {user.username}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}