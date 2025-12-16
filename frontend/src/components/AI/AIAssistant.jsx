/**
 * AI Assistant Component
 * ======================
 * Main component for AI features with tabs for Suggestions, Chat, and Weekly Summary.
 */

import { useState } from 'react'
import AISuggestions from './AISuggestions'
import AIChat from './AIChat'
import AIWeeklySummary from './WeeklySummary'
import { SparklesIcon, FireIcon } from '../Common/Icons'

// Chat icon component
function ChatIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

// Chart icon component
function ChartIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

// Robot icon component
function RobotIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  )
}

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState('suggestions')

  const tabs = [
    { id: 'suggestions', label: 'Habit Suggestions', Icon: SparklesIcon, FireIcon: FireIcon },
    { id: 'chat', label: 'Chat', Icon: ChatIcon },
    { id: 'summary', label: 'Weekly Summary', Icon: ChartIcon }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -top-1 -left-1 w-10 h-10 bg-accent-500 rounded-full opacity-20 blur-sm"></div>
          <RobotIcon className="w-8 h-8 text-accent-400 relative z-10" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-200">
            AI Assistant
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Get personalized habit suggestions, chat with AI, and view your weekly insights
          </p>
        </div>
      </div>

      {/* Tabs and Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Tabs */}
        <div className="flex-1 border-b border-dark-400">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.Icon
              const FireIconComponent = tab.FireIcon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-accent-500 text-accent-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-dark-500'
                  }`}
                >
                  {tab.id === 'suggestions' && FireIconComponent && (
                    <FireIconComponent className="w-4 h-4 text-sunset-400" />
                  )}
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'suggestions' && <AISuggestions />}
        {activeTab === 'chat' && <AIChat />}
        {activeTab === 'summary' && <AIWeeklySummary />}
      </div>
    </div>
  )
}


