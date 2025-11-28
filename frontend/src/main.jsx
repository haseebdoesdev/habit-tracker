/**
 * Application Entry Point
 * =======================
 * [HASEEB] This is your file to implement.
 * 
 * This is where React renders into the DOM.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// TODO: Import BrowserRouter from react-router-dom
// WHY: Enable client-side routing for the app
// APPROACH: Wrap App with BrowserRouter

// TODO: Import context providers
// WHY: Make global state available to all components
// APPROACH: Import AuthProvider, PartyProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* TODO: Wrap App with BrowserRouter */}
    {/* WHY: Enable routing throughout the app */}
    
    {/* TODO: Wrap with AuthProvider */}
    {/* WHY: Auth state available everywhere */}
    
    {/* TODO: Wrap with PartyProvider */}
    {/* WHY: Party state available everywhere */}
    
    <App />
  </React.StrictMode>,
)

