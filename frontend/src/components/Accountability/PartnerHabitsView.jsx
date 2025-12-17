/**
 * Partner Habits View Component
 * View partner's habits and provide feedback
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import accountabilityService from '../../services/accountabilityService'
import { formatDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function PartnerHabitsView() {
  const { partnerId } = useParams()
  const navigate = useNavigate()
  
  const [partnerData, setPartnerData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedHabitId, setSelectedHabitId] = useState(null)
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPartnerHabits()
  }, [partnerId])

  const fetchPartnerHabits = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const data = await accountabilityService.getPartnerHabits(partnerId)
      setPartnerData(data)
    } catch (err) {
      setError(err.message || 'Failed to load partner habits')
      console.error('Failed to fetch partner habits:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    
    if (!commentContent.trim() || !selectedHabitId) {
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      await accountabilityService.addComment(selectedHabitId, commentContent.trim(), null)
      setCommentContent('')
      setSelectedHabitId(null)
      await fetchPartnerHabits() // Refresh to show new comment
    } catch (err) {
      setError(err.message || 'Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadComments = async (habitId) => {
    try {
      const comments = await accountabilityService.getHabitComments(habitId)
      // Update the habit in the list with comments
      setPartnerData(prev => ({
        ...prev,
        habits: prev.habits.map(habit => 
          habit.id === habitId ? { ...habit, comments } : habit
        )
      }))
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading partner habits..." />
      </div>
    )
  }

  if (error || !partnerData) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error || 'Partner data not found'}
        <Link to="/accountability" className="ml-4 text-blue-600 hover:underline">
          Back to Accountability Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/accountability"
          className="link text-sm mb-2 inline-block"
        >
          ← Back to Accountability Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-gray-200">
          {partnerData.partner_username}'s Habits
        </h1>
        <p className="text-gray-400 mt-1">
          Overall completion rate: {partnerData.overall_completion_rate.toFixed(1)}%
        </p>
      </div>

      {/* Partner Summary */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Partner Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Total Habits</p>
            <p className="text-2xl font-semibold text-gray-200">
              {partnerData.habits?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Completion Rate</p>
            <p className="text-2xl font-semibold text-accent-400">
              {partnerData.overall_completion_rate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Active Streaks</p>
            <p className="text-2xl font-semibold text-solar-400">
              {partnerData.current_streaks?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-200">Habits</h2>
        
        {!partnerData.habits || partnerData.habits.length === 0 ? (
          <div className="empty-state card">
            <p className="empty-state-text">No habits found for this partner.</p>
          </div>
        ) : (
          partnerData.habits.map(habit => (
            <div key={habit.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-200">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-gray-400 mt-1">{habit.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-400">
                    <span className="capitalize">{habit.category || 'Other'}</span>
                    <span className="capitalize">{habit.frequency || 'Daily'}</span>
                    <span>Streak: {habit.current_streak || 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  {habit.completed_today ? (
                    <span className="badge-success">
                      Completed Today
                    </span>
                  ) : (
                    <span className="badge">
                      Not Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-dark-400/50 pt-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-200">Comments</h4>
                  <button
                    onClick={() => {
                      setSelectedHabitId(habit.id)
                      loadComments(habit.id)
                    }}
                    className="text-sm link"
                  >
                    {selectedHabitId === habit.id ? 'Hide Comments' : 'View Comments'}
                  </button>
                </div>

                {selectedHabitId === habit.id && (
                  <>
                    {/* Comment Form */}
                    <form onSubmit={handleAddComment} className="mb-4">
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Add an encouraging comment..."
                        className="input resize-none mb-2"
                        rows="3"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !commentContent.trim()}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        {isSubmitting ? 'Posting...' : 'Add Comment'}
                      </button>
                    </form>

                    {/* Comments List */}
                    {habit.comments && habit.comments.length > 0 && (
                      <div className="space-y-3">
                        {habit.comments.map(comment => (
                          <div key={comment.id} className="p-3 bg-dark-300/50 rounded-soft border border-dark-400/50">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-200 text-sm">
                                {comment.author_username}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.created_at, 'short')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}



