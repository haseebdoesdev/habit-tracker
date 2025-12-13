/**
 * Application Entry Point
 * React renders into the DOM here with routing and global state providers
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { PartyProvider } from './context/PartyContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PartyProvider>
          <App />
        </PartyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
