/**
 * OAuth2Callback.jsx - Handles the redirect from Google SSO.
 *
 * After Google login, Spring Boot redirects to:
 *   http://localhost:3000/oauth2/callback?token=JWT&username=...&role=...
 *
 * This page extracts those params, saves to auth context, and navigates to dashboard.
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const role = searchParams.get('role');

    if (token && username) {
      login(token, { username, role, email: '', fullName: username, avatarUrl: '' });
      toast.success(`Welcome, ${username}! 🎉`);
      navigate('/', { replace: true });
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/login', { replace: true });
    }
  }, [login, navigate, searchParams]); // ✅ FIXED

  return (
    <div className="loading-screen">
      <div className="loading-logo">S</div>
      <div className="loading-spinner" />
      <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 14 }}>
        Completing Google sign-in...
      </p>
    </div>
  );
}
