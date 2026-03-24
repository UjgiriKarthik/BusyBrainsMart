/**
 * AuthContext.js - Global authentication state using React Context API.
 *
 * Provides:
 * - `user`       : current user object (null if not logged in)
 * - `login()`    : saves token + user, updates state
 * - `logout()`   : clears token + user, redirects to login
 * - `isAdmin()`  : helper to check if current user has ADMIN role
 * - `loading`    : true during initial auth check
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * On mount, restore auth state from localStorage
   * so users stay logged in after page refresh.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Save JWT token and user data to localStorage and state.
   * Called after successful login or OAuth2 redirect.
   *
   * @param {string} token - JWT Bearer token
   * @param {object} userData - User info from backend
   */
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Clear all auth data and return to login page.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Check if the current user has the Admin role.
   * Used to conditionally show admin UI controls.
   */
  const isAdmin = () => user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for consuming auth context.
 * Usage: const { user, login, logout, isAdmin } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
