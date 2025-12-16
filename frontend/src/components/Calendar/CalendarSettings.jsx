/**
 * Calendar Settings Component
 * Manage Google Calendar integration
 */

import { useState, useEffect } from 'react'
import calendarService from '../../services/calendarService'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function CalendarSettings() {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    fetchStatus()
    
    // Check if we just came back from OAuth callback
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') === 'true' || window.location.pathname.includes('/calendar/connected')) {
      setSuccess('Google Calendar connected successfully!')
      // Clean up URL
      window.history.replaceState({}, '', '/calendar')
    }
  }, [])

  const fetchStatus = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await calendarService.getStatus()
      setStatus(data)
    } catch (err) {
      setError(err.message || 'Failed to load calendar status')
      console.error('Failed to fetch calendar status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setError('')
      const data = await calendarService.getOAuthUrl()
      // Redirect to Google OAuth URL
      window.location.href = data.authorization_url
    } catch (err) {
      setError(err.message || 'Failed to get authorization URL')
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) {
      return
    }
    
    try {
      setError('')
      await calendarService.disconnect()
      await fetchStatus() // Refresh status
    } catch (err) {
      setError(err.message || 'Failed to disconnect calendar')
    }
  }

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      setError('')
      await calendarService.syncHabits()
      alert('Habits synced to Google Calendar successfully!')
    } catch (err) {
      setError(err.message || 'Failed to sync habits')
    } finally {
      setIsSyncing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading calendar settings..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-200">Calendar Settings</h1>
        <p className="text-gray-400 mt-1">
          Connect and manage your Google Calendar integration
        </p>
      </div>

      {error && (
        <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-solar-600/20 border border-solar-500/50 text-solar-300 p-4 rounded-organic">
          {success}
        </div>
      )}

      {/* Connection Status */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Connection Status</h2>
        
        {status && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">
                  {status.connected ? 'Connected' : 'Not Connected'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {status.message}
                </p>
              </div>
              <div>
                {status.connected ? (
                  <span className="badge-success">
                    Active
                  </span>
                ) : (
                  <span className="badge">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-dark-400/50">
              {status.connected ? (
                <>
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="btn-primary"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync Habits to Calendar'}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 border border-terracotta-500/50 text-terracotta-400 rounded-organic hover:bg-terracotta-600/20 transition-colors"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConnect}
                  className="btn-primary"
                >
                  Connect Google Calendar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="card bg-accent-600/20 border-accent-500/50">
        <h3 className="text-lg font-medium text-gray-200 mb-2">About Calendar Integration</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Sync your habits to Google Calendar for reminders</li>
          <li>Calendar events are created based on your habit reminder times</li>
          <li>Events recur based on your habit frequency (daily, weekly, etc.)</li>
          <li>You can sync all habits at once or manage them individually</li>
        </ul>
      </div>
    </div>
  )
}


