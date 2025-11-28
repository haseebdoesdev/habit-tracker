/**
 * Navbar Component
 * ================
 * [NOUMAN] This is your component to implement.
 * 
 * Top navigation bar.
 */

// TODO: Import Link from react-router-dom
// TODO: Import useAuth hook

export default function Navbar() {
  // TODO: Get auth state from context
  // WHY: Show different nav for logged in/out users
  // APPROACH: const { user, logout } = useAuth()
  
  const handleLogout = () => {
    // TODO: Call logout function from auth context
    // WHY: Clear auth state and token
    
    // TODO: Redirect to login page
    // WHY: User is no longer authenticated
  }
  
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <a href="/" className="text-xl font-bold text-blue-600">
            Habit Tracker
          </a>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {/* TODO: Conditionally render based on auth state */}
            {/*
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/habits" className="text-gray-600 hover:text-gray-900">
                  Habits
                </Link>
                <Link to="/analytics" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Link>
                <Link to="/parties" className="text-gray-600 hover:text-gray-900">
                  Parties
                </Link>
                
                {/* User menu */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
            */}
            
            {/* Placeholder links */}
            <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
            <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

