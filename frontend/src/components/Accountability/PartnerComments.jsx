/**
 * PartnerComments Component
 * =========================
 * [HASEEB] This is your component to implement.
 * 
 * Comments on partner's habits.
 */

import { useState, useEffect } from 'react'
import LoadingSpinner from '../Common/LoadingSpinner'
import accountabilityService from '../../services/accountabilityService'

export default function PartnerComments({ habitId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true)
        const data = await accountabilityService.getHabitComments(habitId)
        setComments(data)
      } catch (err) {
        console.error("Failed to load comments:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (habitId) {
      fetchComments()
    }
  }, [habitId])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      return
    }
    
    setIsSending(true)
    
    try {
      const addedComment = await accountabilityService.addComment(habitId, newComment.trim())
      setComments([...comments, addedComment])
      setNewComment('')
    } catch (err) {
      console.error("Failed to add comment:", err)
      // TODO: Show error feedback to user (could use a toast/alert component)
    } finally {
      setIsSending(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Partner Comments</h3>
      
      {/* Comments list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner size="sm" message="Loading comments..." />
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{comment.author_username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSending || !newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

