/**
 * Icon Components
 * ==============
 * Custom SVG icons to replace emojis throughout the app
 */

export function HomeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

export function ListIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

export function CheckIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function ChartIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

export function SmileIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export function UsersIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}

export function HandshakeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  )
}

export function CalendarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

export function SparklesIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}

export function UserIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

export function SettingsIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export function FireIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.59 10.07 16.3 9.75 16.08 9.4C15.93 9.17 15.81 8.91 15.73 8.64C15.65 8.37 15.6 8.09 15.6 7.8C15.6 6.58 16.17 5.44 17.13 4.7C17.59 4.35 18.13 4.1 18.7 4C18.42 3.4 18.01 2.87 17.5 2.44C16.98 2.01 16.37 1.69 15.72 1.5C15.49 1.43 15.25 1.39 15 1.39C14.75 1.39 14.51 1.43 14.28 1.5C13.63 1.69 13.02 2.01 12.5 2.44C11.99 2.87 11.58 3.4 11.3 4C11.87 4.1 12.41 4.35 12.87 4.7C13.83 5.44 14.4 6.58 14.4 7.8C14.4 8.09 14.35 8.37 14.27 8.64C14.19 8.91 14.07 9.17 13.92 9.4C13.7 9.75 13.41 10.07 13.11 10.38C12.85 10.64 12.57 10.9 12.34 11.2C11.73 11.94 11.3 12.81 11.1 13.75C10.9 14.69 10.94 15.67 11.22 16.59C11.5 17.51 12.01 18.35 12.71 19.01C13.41 19.67 14.28 20.13 15.23 20.33C16.17 20.53 17.15 20.49 18.07 20.21C18.99 19.93 19.83 19.42 20.49 18.72C21.15 18.02 21.61 17.15 21.81 16.21C22.01 15.27 21.97 14.29 21.69 13.37C21.41 12.45 20.9 11.61 20.2 10.95C19.5 10.29 18.63 9.83 17.69 9.63C17.25 9.55 16.8 9.5 16.34 9.5C16.12 9.5 15.9 9.52 15.68 9.55C16.17 9.95 16.6 10.42 16.95 10.95C17.3 11.48 17.56 12.07 17.72 12.69C17.88 13.31 17.94 13.96 17.9 14.6C17.86 15.24 17.72 15.87 17.48 16.46C17.24 17.05 16.91 17.59 16.5 18.06C16.09 18.53 15.61 18.92 15.07 19.22C14.53 19.52 13.94 19.72 13.33 19.82C12.72 19.92 12.09 19.92 11.48 19.82C10.87 19.72 10.28 19.52 9.74 19.22C9.2 18.92 8.72 18.53 8.31 18.06C7.9 17.59 7.57 17.05 7.33 16.46C7.09 15.87 6.95 15.24 6.91 14.6C6.87 13.96 6.93 13.31 7.09 12.69C7.25 12.07 7.51 11.48 7.86 10.95C8.21 10.42 8.64 9.95 9.13 9.55C8.91 9.52 8.69 9.5 8.47 9.5C8.01 9.5 7.56 9.55 7.12 9.63C6.18 9.83 5.31 10.29 4.61 10.95C3.91 11.61 3.4 12.45 3.12 13.37C2.84 14.29 2.8 15.27 3 16.21C3.2 17.15 3.66 18.02 4.32 18.72C4.98 19.42 5.82 19.93 6.74 20.21C7.66 20.49 8.64 20.53 9.58 20.33C10.52 20.13 11.39 19.67 12.09 19.01C12.79 18.35 13.3 17.51 13.58 16.59C13.86 15.67 13.9 14.69 13.7 13.75C13.5 12.81 13.07 11.94 12.46 11.2C12.23 10.9 11.95 10.64 11.69 10.38C11.39 10.07 11.1 9.75 10.88 9.4C10.73 9.17 10.61 8.91 10.53 8.64C10.45 8.37 10.4 8.09 10.4 7.8C10.4 6.58 10.97 5.44 11.93 4.7C12.39 4.35 12.93 4.1 13.5 4C13.22 3.4 12.81 2.87 12.3 2.44C11.78 2.01 11.17 1.69 10.52 1.5C10.29 1.43 10.05 1.39 9.8 1.39C9.55 1.39 9.31 1.43 9.08 1.5C8.43 1.69 7.82 2.01 7.3 2.44C6.79 2.87 6.38 3.4 6.1 4C6.67 4.1 7.21 4.35 7.67 4.7C8.63 5.44 9.2 6.58 9.2 7.8C9.2 8.09 9.15 8.37 9.07 8.64C8.99 8.91 8.87 9.17 8.72 9.4C8.5 9.75 8.21 10.07 7.91 10.38C7.65 10.64 7.37 10.9 7.14 11.2C6.53 11.94 6.1 12.81 5.9 13.75C5.7 14.69 5.74 15.67 6.02 16.59C6.3 17.51 6.81 18.35 7.51 19.01C8.21 19.67 9.08 20.13 10.02 20.33C10.96 20.53 11.94 20.49 12.86 20.21C13.78 19.93 14.62 19.42 15.28 18.72C15.94 18.02 16.4 17.15 16.6 16.21C16.8 15.27 16.76 14.29 16.48 13.37C16.2 12.45 15.69 11.61 14.99 10.95C14.29 10.29 13.42 9.83 12.48 9.63C12.04 9.55 11.59 9.5 11.13 9.5C10.91 9.5 10.69 9.52 10.47 9.55C10.96 9.95 11.39 10.42 11.74 10.95C12.09 11.48 12.35 12.07 12.51 12.69C12.67 13.31 12.73 13.96 12.69 14.6C12.65 15.24 12.51 15.87 12.27 16.46C12.03 17.05 11.7 17.59 11.29 18.06C10.88 18.53 10.4 18.92 9.86 19.22C9.32 19.52 8.73 19.72 8.12 19.82C7.51 19.92 6.88 19.92 6.27 19.82C5.66 19.72 5.07 19.52 4.53 19.22C3.99 18.92 3.51 18.53 3.1 18.06C2.69 17.59 2.36 17.05 2.12 16.46C1.88 15.87 1.74 15.24 1.7 14.6C1.66 13.96 1.72 13.31 1.88 12.69C2.04 12.07 2.3 11.48 2.65 10.95C3 10.42 3.43 9.95 3.92 9.55C3.7 9.52 3.48 9.5 3.26 9.5C2.8 9.5 2.35 9.55 1.91 9.63C0.97 9.83 0.1 10.29 -0.6 10.95C-1.3 11.61 -1.81 12.45 -2.09 13.37C-2.37 14.29 -2.41 15.27 -2.21 16.21C-2.01 17.15 -1.55 18.02 -0.89 18.72C-0.23 19.42 0.61 19.93 1.53 20.21C2.45 20.49 3.43 20.53 4.37 20.33C5.31 20.13 6.18 19.67 6.88 19.01C7.58 18.35 8.09 17.51 8.37 16.59C8.65 15.67 8.69 14.69 8.49 13.75C8.29 12.81 7.86 11.94 7.25 11.2Z" />
    </svg>
  )
}

export function MoonIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

export function SeedlingIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  )
}

