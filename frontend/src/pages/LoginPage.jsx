import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Username:', formData.username);
    console.log('Password:', formData.password);

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    if (loading) return; // prevent double submit
    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      login(data.token, {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
      });

      toast.success(`Welcome back, ${data.username}!`);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Invalid username or password.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Is the backend running on port 8080?');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Full browser navigation — NOT an Axios call
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const fillDemo = (role) => {
    if (role === 'admin') setFormData({ username: 'admin', password: 'admin123' });
    else setFormData({ username: 'user', password: 'user123' });
  };

  return (
    <div className="auth-layout">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-grid" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo">S</div>
          <div className="auth-visual-tagline">BusyBrainsMart</div>
          <p className="auth-visual-sub">
            Your premium destination for electronics, fashion, and everything in between.
          </p>
          <div className="auth-visual-features">
            {[
              'Millions of products at great prices',
              'Fast & secure checkout',
              'Role-based admin dashboard',
              'SSO with Google account',
            ].map((f) => (
              <div key={f} className="auth-feature-item">
                <div className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-subtitle">Sign in to your BusyBrainsMart account</p>
          </div>

          {/* Demo login shortcuts */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => fillDemo('admin')}
              type="button"
            >
              👑 Demo Admin
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => fillDemo('user')}
              type="button"
            >
              👤 Demo User
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(233,69,96,0.1)',
                border: '1px solid rgba(233,69,96,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 14,
                color: 'var(--accent-red)',
              }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <div className="auth-divider-line" />
          </div>

          {/* Google button uses window.location.href — NOT Axios */}
          <button className="btn btn-google" onClick={handleGoogleLogin} type="button">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}