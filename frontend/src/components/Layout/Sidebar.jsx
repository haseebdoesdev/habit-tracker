/**
 * Sidebar Component
 * =================
 * [OMAMAH] This is your component to implement.
 * 
 * Side navigation for logged in users.
 */

// TODO: Import Link, useLocation from react-router-dom
// TODO: Import useAuth hook

export default function Sidebar() {
  // TODO: Get current location for active state
  // WHY: Highlight current page in nav
  // APPROACH: const location = useLocation()
  
  // TODO: Define navigation items
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/habits', label: 'My Habits', icon: '📋' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/ai', label: 'AI Suggestions', icon: '🤖' },
    { path: '/parties', label: 'Parties', icon: '👥' },
    { path: '/accountability', label: 'Partners', icon: '🤝' },
  ]
  
  const isActive = (path) => {
    // TODO: Check if current path matches
    // WHY: Determine if nav item is active
    // APPROACH: Compare with location.pathname
    return false // Placeholder
  }
  
  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-4">
        {/* User profile summary */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
          {/* TODO: Show user avatar and name */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            U
          </div>
          <div>
            <p className="font-medium">Username</p>
            <p className="text-sm text-gray-500">View Profile</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {/* TODO: Map through navItems */}
          {navItems.map(item => (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        {/* Quick stats */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white">
          <p className="text-sm opacity-80">Current Streak</p>
          <p className="text-2xl font-bold">🔥 0 days</p>
        </div>
      </div>
    </aside>
  )
}

