/**
 * Main Application Component
 * Sets up routing and main layout for the app
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoadingSpinner from './components/Common/LoadingSpinner'

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
import HabitDetails from './components/Habits/HabitDetails'
import HabitLogsHistory from './components/Habits/HabitLogsHistory'

// Logs
import DailyLogView from './components/Logs/DailyLogView'
import WeeklySummary from './components/Logs/WeeklySummary'

// Analytics
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard'
import MoodInsightsPage from './components/Mood/MoodInsightsPage'

// AI
import AIAssistant from './components/AI/AIAssistant'

// Party/Accountability
import PartyList from './components/Party/PartyList'
import CreateParty from './components/Party/CreateParty'
import PartyDashboard from './components/Party/PartyDashboard'
import CreatePartyGoal from './components/Party/CreatePartyGoal'
import PartyGoalDetails from './components/Party/PartyGoalDetails'
import PartnerDashboard from './components/Accountability/PartnerDashboard'
import RequestPartnership from './components/Accountability/RequestPartnership'
import PartnerHabitsView from './components/Accountability/PartnerHabitsView'
import PartnerRequest from './components/Accountability/PartnerRequest'

// Settings
import CalendarSettings from './components/Calendar/CalendarSettings'
import ProfilePage from './components/Profile/ProfilePage'
import SettingsPage from './components/Settings/SettingsPage'

function App() {
  const { user, isLoading } = useAuth()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-lunar">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-lunar">
      <Navbar />

      <div className="flex">
        {user && <Sidebar />}

        <main className="flex-1 p-6 lg:p-8 animate-fade-in">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/habits" element={<ProtectedRoute><HabitList /></ProtectedRoute>} />
            <Route path="/habits/new" element={<ProtectedRoute><CreateHabit /></ProtectedRoute>} />
            <Route path="/habits/:id" element={<ProtectedRoute><HabitDetails /></ProtectedRoute>} />
            <Route path="/habits/:id/edit" element={<ProtectedRoute><EditHabit /></ProtectedRoute>} />
            <Route path="/habits/:id/logs" element={<ProtectedRoute><HabitLogsHistory /></ProtectedRoute>} />
            <Route path="/logs/daily/:date" element={<ProtectedRoute><DailyLogView /></ProtectedRoute>} />
            <Route path="/logs/weekly" element={<ProtectedRoute><WeeklySummary /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
            <Route path="/analytics/mood" element={<ProtectedRoute><MoodInsightsPage /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/parties" element={<ProtectedRoute><PartyList /></ProtectedRoute>} />
            <Route path="/parties/new" element={<ProtectedRoute><CreateParty /></ProtectedRoute>} />
            <Route path="/parties/:id" element={<ProtectedRoute><PartyDashboard /></ProtectedRoute>} />
            <Route path="/parties/:id/goals/new" element={<ProtectedRoute><CreatePartyGoal /></ProtectedRoute>} />
            <Route path="/parties/:id/goals/:goalId" element={<ProtectedRoute><PartyGoalDetails /></ProtectedRoute>} />
            <Route path="/accountability" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
            <Route path="/accountability/request" element={<ProtectedRoute><RequestPartnership /></ProtectedRoute>} />
            <Route path="/accountability/requests" element={<ProtectedRoute><PartnerRequest /></ProtectedRoute>} />
            <Route path="/accountability/partner/:partnerId" element={<ProtectedRoute><PartnerHabitsView /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarSettings /></ProtectedRoute>} />
            <Route path="/calendar/connected" element={<ProtectedRoute><CalendarSettings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

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
