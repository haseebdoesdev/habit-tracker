/**
 * Party Goal Details Component
 * View detailed goal information and contribute
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import partyGoalService from '../../services/partyGoalService'
import { formatDate, fromAPIDate, toAPIDate } from '../../utils/dateHelpers'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function PartyGoalDetails() {
  const { id: partyId, goalId } = useParams()
  const navigate = useNavigate()
  
  const [goal, setGoal] = useState(null)
  const [contributors, setContributors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [contributionAmount, setContributionAmount] = useState(1)
  const [isContributing, setIsContributing] = useState(false)

  useEffect(() => {
    fetchGoalData()
  }, [goalId])

  const fetchGoalData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const [goalData, contributorsData] = await Promise.all([
        partyGoalService.getGoal(goalId),
        partyGoalService.getContributors(goalId).catch(() => [])
      ])
      
      setGoal(goalData)
      setContributors(contributorsData)
    } catch (err) {
      setError(err.message || 'Failed to load goal details')
      console.error('Failed to fetch goal data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContribute = async (e) => {
    e.preventDefault()
    
    if (!goal || goal.status !== 'ACTIVE') {
      alert('Cannot contribute to a non-active goal')
      return
    }
    
    try {
      setIsContributing(true)
      await partyGoalService.contribute(goalId, contributionAmount)
      await fetchGoalData() // Refresh data
      setContributionAmount(1) // Reset
    } catch (err) {
      alert(err.message || 'Failed to contribute to goal')
    } finally {
      setIsContributing(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return
    }
    
    try {
      await partyGoalService.deleteGoal(goalId)
      navigate(`/parties/${partyId}`)
    } catch (err) {
      alert(err.message || 'Failed to delete goal')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" message="Loading goal details..." />
      </div>
    )
  }

  if (error || !goal) {
    return (
      <div className="bg-terracotta-600/20 border border-terracotta-500/50 text-terracotta-300 p-4 rounded-organic">
        {error || 'Goal not found'}
        <Link to={`/parties/${partyId}`} className="ml-4 link">
          Back to Party
        </Link>
      </div>
    )
  }

  const progressPercentage = goal.progress_percentage || ((goal.current_value / goal.target_value) * 100)
  const isActive = goal.status === 'ACTIVE'
  const isCompleted = goal.status === 'COMPLETED'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to={`/parties/${partyId}`}
            className="link text-sm mb-2 inline-block"
          >
            ← Back to Party
          </Link>
          <h1 className="text-2xl font-semibold text-gray-200">{goal.title}</h1>
          {goal.description && (
            <p className="text-gray-400 mt-2">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-terracotta-500/50 text-terracotta-400 rounded-organic hover:bg-terracotta-600/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div>
        {isCompleted && (
          <span className="badge-success">
            Completed
          </span>
        )}
        {goal.status === 'FAILED' && (
          <span className="badge-error">
            Failed
          </span>
        )}
        {goal.status === 'CANCELLED' && (
          <span className="badge">
            Cancelled
          </span>
        )}
        {isActive && (
          <span className="badge bg-accent-600/30 text-accent-300 border border-accent-500/50">
            Active
          </span>
        )}
      </div>

      {/* Progress Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200">Progress</h2>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-200">
              {goal.current_value} / {goal.target_value}
            </p>
            <p className="text-sm text-gray-400">
              {progressPercentage.toFixed(1)}% complete
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-dark-400 rounded-full h-4 mb-4">
          <div
            className="bg-accent-500 h-4 rounded-full transition-all"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        {/* Goal Details */}
        <dl className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <dt className="text-sm font-medium text-gray-400">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-200">
              {formatDate(goal.start_date, 'long')}
            </dd>
          </div>
          {goal.end_date && (
            <div>
              <dt className="text-sm font-medium text-gray-400">End Date</dt>
              <dd className="mt-1 text-sm text-gray-200">
                {formatDate(goal.end_date, 'long')}
              </dd>
            </div>
          )}
          {goal.habit_category && (
            <div>
              <dt className="text-sm font-medium text-gray-400">Category Filter</dt>
              <dd className="mt-1 text-sm text-gray-200 capitalize">{goal.habit_category}</dd>
            </div>
          )}
          {goal.reward_points > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-400">Reward Points</dt>
              <dd className="mt-1 text-sm text-gray-200">{goal.reward_points}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Contribution Form (if active) */}
      {isActive && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Contribute</h2>
          <form onSubmit={handleContribute} className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Contribution Amount
              </label>
              <input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(parseInt(e.target.value) || 1)}
                min="1"
                className="input"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isContributing}
                className="btn-primary"
              >
                {isContributing ? 'Contributing...' : 'Contribute'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contributors List */}
      {contributors.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-medium text-gray-200 mb-4">Contributors</h2>
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <div key={contributor.user_id || index} className="flex items-center justify-between border-b border-dark-400/50 pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  {contributor.avatar_url && (
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.username}
                      className="w-10 h-10 rounded-full border border-dark-400"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-200">{contributor.username}</p>
                    <p className="text-sm text-gray-400">
                      {contributor.contribution_percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-200">
                    {contributor.contribution_points} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}



