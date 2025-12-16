/**
 * Sidebar Component
 * =================
 * Side navigation for logged in users.
 */

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/habits', label: 'My Habits', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/ai', label: 'AI Suggestions', icon: '🤖' },
    { path: '/parties', label: 'Parties', icon: '👥' },
    { path: '/accountability', label: 'Partners', icon: '🤝' },
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }
  
  const userInitial = user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
  
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>
          <div>
            <p className="font-medium">{user?.username || user?.email || 'User'}</p>
            <p className="text-sm text-gray-500">View Profile</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
          <p className="text-sm opacity-80">Current Streak</p>
          <p className="text-2xl font-bold">🔥 0 days</p>
        </div>
      </div>
    </aside>
  )
}

