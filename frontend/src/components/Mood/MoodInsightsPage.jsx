/**
 * Mood Insights Page Component
 * Full page wrapper for mood insights
 */

import MoodInsights from './MoodInsights'

export default function MoodInsightsPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-200 mb-6">Mood Insights</h1>
      <MoodInsights />
    </div>
  )
}



