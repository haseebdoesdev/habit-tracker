import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // TODO: Check for token in localStorage on mount
    // WHY: Persist login state across page reloads
    useEffect(() => {
        // TODO: Verify token with backend
    }, []);

    const login = async (email, password) => {
        // TODO: Call login API
        // WHY: Authenticate user

        // TODO: Save token to localStorage
        // WHY: Keep user logged in

        // TODO: Set user state
    };

    const logout = () => {
        // TODO: Remove token and clear state
        // WHY: Securely end session
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
