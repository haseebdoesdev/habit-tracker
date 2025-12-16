/**
 * LoadingSpinner Component
 * ========================
 * Reusable loading spinner for consistent loading states across the app.
 */

export default function LoadingSpinner({ size = 'md', message = null, className = '' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="mt-4 text-gray-500">{message}</p>
      )}
    </div>
  )
}






