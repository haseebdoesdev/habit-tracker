/**
 * LoadingState Component
 * =====================
 * Full-page or section loading state with spinner and message.
 */

import LoadingSpinner from './LoadingSpinner'

export default function LoadingState({ message = 'Loading...', fullPage = false }) {
  const containerClass = fullPage 
    ? 'flex items-center justify-center h-64' 
    : 'text-center py-8'
  
  return (
    <div className={containerClass}>
      <LoadingSpinner size="md" message={message} />
    </div>
  )
}






