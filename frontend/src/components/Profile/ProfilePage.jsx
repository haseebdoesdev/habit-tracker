/**
 * Profile Page Component
 * View and edit user profile
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { formatDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: '',
    bio: '',
    timezone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        avatar_url: user.avatar_url || '',
        bio: user.bio || '',
        timezone: user.timezone || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await authService.updateProfile(formData)
      await refreshUser() // Refresh user context
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || '',
        avatar_url: user.avatar_url || '',
        bio: user.bio || '',
        timezone: user.timezone || ''
      })
    }
    setIsEditing(false)
    setError('')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading profile..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-200">Profile</h1>
        <p className="text-gray-400 mt-1">
          Manage your account information
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

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-200">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                required
                minLength={3}
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/avatar.jpg"
              />
              {formData.avatar_url && (
                <img
                  src={formData.avatar_url}
                  alt="Avatar preview"
                  className="mt-2 w-16 h-16 rounded-full border border-dark-400"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input resize-none"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Timezone
              </label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="input"
                placeholder="UTC, America/New_York, etc."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-400">Email</dt>
              <dd className="mt-1 text-sm text-gray-200">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Username</dt>
              <dd className="mt-1 text-sm text-gray-200">{user.username}</dd>
            </div>
            {user.avatar_url && (
              <div>
                <dt className="text-sm font-medium text-gray-400">Avatar</dt>
                <dd className="mt-1">
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border border-dark-400"
                  />
                </dd>
              </div>
            )}
            {user.bio && (
              <div>
                <dt className="text-sm font-medium text-gray-400">Bio</dt>
                <dd className="mt-1 text-sm text-gray-200">{user.bio}</dd>
              </div>
            )}
            {user.timezone && (
              <div>
                <dt className="text-sm font-medium text-gray-400">Timezone</dt>
                <dd className="mt-1 text-sm text-gray-200">{user.timezone}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-400">User Type</dt>
              <dd className="mt-1 text-sm text-gray-200 capitalize">{user.user_type?.toLowerCase() || 'Regular'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-200">
                {formatDate(user.created_at, 'long')}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  )
}



