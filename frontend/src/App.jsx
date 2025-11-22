import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
// TODO: Import components (Login, Register, Dashboard, etc.)
// WHY: Map routes to specific page components

const App = () => {
    return (
        <Router>
            <div className="app-container">
                {/* TODO: Add Navbar here */}
                {/* WHY: Navigation should be visible on most pages */}

                <Routes>
                    <Route path="/login" element={<Login />} />
                    {/* TODO: Define Route for /login */}
                    {/* WHY: Public route for authentication */}

                    {/* TODO: Define Route for /register */}

                    {/* TODO: Define Protected Route for /dashboard */}
                    {/* WHY: Only authenticated users should see their data */}

                    {/* TODO: Define other routes (habits, analytics, etc.) */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
