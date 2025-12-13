/**
 * Main Application Component
 * Sets up routing and main layout for the app
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout components
import Navbar from './components/Layout/Navbar'
import Sidebar from './components/Layout/Sidebar'

// Auth pages
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

// Dashboard
import Dashboard from './components/Dashboard/Dashboard'

// Habits
import HabitList from './components/Habits/HabitList'
import CreateHabit from './components/Habits/CreateHabit'
import EditHabit from './components/Habits/EditHabit'

// Analytics
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard'

// AI
import AISuggestions from './components/AI/AISuggestions'

// Party/Accountability
import PartyList from './components/Party/PartyList'
import CreateParty from './components/Party/CreateParty'
import PartyDashboard from './components/Party/PartyDashboard'
import PartnerDashboard from './components/Accountability/PartnerDashboard'

function App() {
  const { user, isLoading } = useAuth()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {user && <Sidebar />}

        <main className="flex-1 p-6">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/habits" element={<ProtectedRoute><HabitList /></ProtectedRoute>} />
            <Route path="/habits/new" element={<ProtectedRoute><CreateHabit /></ProtectedRoute>} />
            <Route path="/habits/:id/edit" element={<ProtectedRoute><EditHabit /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AISuggestions /></ProtectedRoute>} />
            <Route path="/parties" element={<ProtectedRoute><PartyList /></ProtectedRoute>} />
            <Route path="/parties/new" element={<ProtectedRoute><CreateParty /></ProtectedRoute>} />
            <Route path="/parties/:id" element={<ProtectedRoute><PartyDashboard /></ProtectedRoute>} />
            <Route path="/accountability" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />

            {/* Catch all - redirect to dashboard or login */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// Protected route wrapper - redirects to login if not authenticated
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default App
