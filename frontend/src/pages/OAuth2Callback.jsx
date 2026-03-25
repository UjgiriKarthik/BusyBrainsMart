/**
 * OAuth2Callback.jsx
 * Handles the redirect from Google SSO.
 *
 * Spring Boot redirects here after successful Google login:
 *   http://localhost:3000/oauth2/callback?token=JWT&username=...&role=...
 *
 * Fetches the full profile from backend using the token,
 * then saves everything to auth context and navigates to dashboard.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState('Completing sign-in...');

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const username = searchParams.get('username');
      const role = searchParams.get('role');

      console.log('OAuth2 callback params:', { token: !!token, username, role });

      if (!token || !username) {
        toast.error('Google login failed. Missing token.');
        navigate('/login', { replace: true });
        return;
      }

      // Save token to localStorage FIRST so profileAPI call includes it
      localStorage.setItem('token', token);

      try {
        setStatus('Loading your profile...');

        // Fetch full profile using the token we just stored
        const { data: profile } = await profileAPI.get();

        // Now login with complete user data
        login(token, {
          id: profile.id || '',
          username: profile.username || username,
          email: profile.email || '',
          role: profile.role || role,
          fullName: profile.fullName || username,
          avatarUrl: profile.avatarUrl || '',
          provider: profile.provider || 'google',
        });

        toast.success(`Welcome, ${profile.username || username}! 🎉`);
        navigate('/', { replace: true });

      } catch (err) {
        console.error('Failed to fetch profile after OAuth2:', err);

        // Fallback: use what we got from the URL params
        login(token, {
          id: '',
          username,
          email: '',
          role: role || 'ROLE_USER',
          fullName: username,
          avatarUrl: '',
          provider: 'google',
        });

        toast.success(`Welcome, ${username}!`);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [login, navigate, searchParams]);

  return (
    <div className="loading-screen">
      <div className="loading-logo">S</div>
      <div className="loading-spinner" />
      <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 14 }}>
        {status}
      </p>
    </div>
  );
}