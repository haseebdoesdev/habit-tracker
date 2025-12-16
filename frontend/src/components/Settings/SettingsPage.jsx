/**
 * Settings Page Component
 * Application settings and preferences
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [timezone, setTimezone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user?.timezone) {
      setTimezone(user.timezone)
    }
  }, [user])

  const handleSaveTimezone = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await authService.updateProfile({ timezone })
      await refreshUser() // Refresh user context
      setSuccess('Timezone updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update timezone')
    } finally {
      setIsLoading(false)
    }
  }

  const commonTimezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-200">Settings</h1>
        <p className="text-gray-400 mt-1">
          Manage your application preferences
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

      {/* General Settings */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">General Settings</h2>
        
        <form onSubmit={handleSaveTimezone} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input"
            >
              <option value="">Select timezone...</option>
              {commonTimezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Or enter custom timezone (e.g., America/New_York)"
              className="input mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for calendar events and reminders
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Account Information */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Account Information</h2>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-400">Email</dt>
            <dd className="mt-1 text-sm text-gray-200">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-400">User Type</dt>
            <dd className="mt-1 text-sm text-gray-200 capitalize">{user.user_type?.toLowerCase() || 'Regular'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-400">Account Status</dt>
            <dd className="mt-1">
              {user.is_active ? (
                <span className="badge-success">
                  Active
                </span>
              ) : (
                <span className="badge">
                  Inactive
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Quick Links */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Quick Links</h2>
        <div className="space-y-2">
          <Link
            to="/profile"
            className="link block"
          >
            Edit Profile →
          </Link>
          <Link
            to="/calendar"
            className="link block"
          >
            Calendar Settings →
          </Link>
        </div>
      </div>
    </div>
  )
}



