/**
 * PartnerComments Component
 * =========================
 * [HASEEB] This is your component to implement.
 * 
 * Comments on partner's habits.
 */

import { useState, useEffect } from 'react'
// TODO: Import accountabilityService

export default function PartnerComments({ habitId }) {
  // TODO: Set up state for comments
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  
  useEffect(() => {
    // TODO: Fetch comments for this habit
    // WHY: Load existing comments
    // APPROACH: await accountabilityService.getHabitComments(habitId)
  }, [habitId])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // TODO: Validate comment
    // WHY: Don't send empty comments
    
    // TODO: Set sending state
    // WHY: Show loading
    
    // TODO: Send comment
    // WHY: Add comment to habit
    // APPROACH: await accountabilityService.addComment(habitId, newComment)
    
    // TODO: Add to local comments
    // WHY: Immediate display
    
    // TODO: Clear input
    // WHY: Ready for next comment
    
    // TODO: Handle errors
    // WHY: Show error feedback
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Partner Comments</h3>
      
      {/* Comments list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        ) : (
          /* TODO: Map through comments */
          /*
          {comments.map(comment => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">{comment.authorUsername}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
          */
          <p className="text-gray-500">Comments will appear here</p>
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

