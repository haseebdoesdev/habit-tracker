/**
 * Navbar Component
 * ================
 * Top navigation bar handling authentication state and routing.
 */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MoonIcon } from '../Common/Icons'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  
  return (
    <nav className="bg-dark-100/90 backdrop-blur-md shadow-soft border-b border-dark-400/50 z-50 relative">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2 group">
            <MoonIcon className="w-6 h-6 text-accent-400 group-hover:text-accent-300 transition-colors duration-300" />
            <span className="text-xl font-bold text-gradient-martian">
              Habit<span className="text-accent-400">Tracker</span>
            </span>
          </Link>          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* desktop nav links - Hidden on mobile if i would add mobile menu later */}
                <div className="hidden md:flex items-center space-x-6 mr-4">
                  <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Dashboard
                  </Link>
                  <Link to="/habits" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Habits
                  </Link>
                  <Link to="/analytics" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Analytics
                  </Link>
                  <Link to="/parties" className="text-gray-300 hover:text-white font-medium transition-colors duration-200">
                    Parties
                  </Link>
                </div>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4 pl-4 border-l border-dark-400">
                  <div className="flex items-center space-x-2">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username} 
                        className="w-8 h-8 rounded-full border border-dark-500 shadow-soft"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-soft">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-200 font-semibold hidden sm:block">
                      {user.username}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-4 py-2"
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