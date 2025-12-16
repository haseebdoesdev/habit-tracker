/**
 * Sidebar Component
 * =================
 * Side navigation for logged in users.
 */

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  HomeIcon, ListIcon, CheckIcon, ChartIcon, SmileIcon, 
  UsersIcon, HandshakeIcon, CalendarIcon, SparklesIcon, 
  UserIcon, SettingsIcon, FireIcon 
} from '../Common/Icons'

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()
  
  const todayDate = new Date().toISOString().split('T')[0]
  
  const navItems = [
    { path: '/', label: 'Dashboard', Icon: HomeIcon },
    { path: '/habits', label: 'My Habits', Icon: ListIcon },
    { path: `/logs/daily/${todayDate}`, label: 'Today\'s Logs', Icon: CheckIcon },
    { path: '/analytics', label: 'Analytics', Icon: ChartIcon },
    { path: '/analytics/mood', label: 'Mood Insights', Icon: SmileIcon },
    { path: '/parties', label: 'Parties', Icon: UsersIcon },
    { path: '/accountability', label: 'Partners', Icon: HandshakeIcon },
    { path: '/calendar', label: 'Calendar', Icon: CalendarIcon },
    { path: '/ai', label: 'AI Assistant', Icon: SparklesIcon },
    { path: '/profile', label: 'Profile', Icon: UserIcon },
    { path: '/settings', label: 'Settings', Icon: SettingsIcon },
  ]
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    // Special handling for daily logs - match any date
    if (path.startsWith('/logs/daily/')) {
      return location.pathname.startsWith('/logs/daily/')
    }
    return location.pathname.startsWith(path)
  }
  
  const userInitial = user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'
  
  return (
    <aside className="w-64 bg-dark-100/80 backdrop-blur-md shadow-gentle border-r border-dark-400/50 min-h-screen">
      <div className="p-5">
        <Link to="/profile" className="block mb-8 animate-fade-in">
          <div className="flex items-center space-x-3 p-4 bg-dark-200/50 rounded-organic hover:shadow-soft transition-all duration-300 cursor-pointer border border-dark-400/30">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-soft">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-200 truncate">{user?.username || user?.email || 'User'}</p>
              <p className="text-sm text-gray-400">View Profile</p>
            </div>
          </div>
        </Link>
        
        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.Icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${isActive(item.path) ? 'nav-item-active' : 'nav-item'} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-8 p-5 bg-gradient-to-br from-accent-500 to-accent-600 rounded-organic text-white shadow-elevated glow-accent animate-fade-in">
          <div className="flex items-center space-x-2 mb-1">
            <FireIcon className="w-5 h-5" />
            <p className="text-sm opacity-90 font-medium">Current Streak</p>
          </div>
          <p className="text-3xl font-bold">0 days</p>
        </div>
      </div>
    </aside>
  )
}

