/**
 * App.js - Root component with React Router navigation.
 *
 * Route structure:
 * /login           - Login page (public)
 * /register        - Registration page (public)
 * /oauth2/callback - Handles Google SSO redirect (public)
 * /                - Dashboard / product listing (protected)
 * /profile         - User profile management (protected)
 *
 * ProtectedRoute: redirects to /login if user is not authenticated.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OAuth2Callback from './pages/OAuth2Callback';
import './styles/globals.css';

/**
 * Wrapper that redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">S</div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

/**
 * Redirect already-logged-in users away from auth pages.
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/favicon.ico" element={<></>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid #e94560',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1a1a2e' },
            },
            error: {
              iconTheme: { primary: '#e94560', secondary: '#1a1a2e' },
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
