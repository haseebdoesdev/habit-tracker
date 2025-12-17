/**
 * LoadingState Component
 * =====================
 * Full-page or section loading state with spinner and message.
 */

import LoadingSpinner from './LoadingSpinner'

export default function LoadingState({ message = 'Loading...', fullPage = false }) {
  const containerClass = fullPage 
    ? 'flex items-center justify-center min-h-[60vh]' 
    : 'text-center py-12'
  
  return (
    <div className={containerClass}>
      <LoadingSpinner size="lg" message={message} />
    </div>
  )
}










