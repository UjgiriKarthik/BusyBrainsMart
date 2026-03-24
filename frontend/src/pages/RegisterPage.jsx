/**
 * RegisterPage.jsx - New user registration form.
 *
 * Validates inputs client-side before sending to Spring Boot backend.
 * On success, redirects to login with a success toast.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (formData.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        autoComplete={name}
      />
      {errors[name] && <p className="text-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="auth-layout">
      {/* Left visual panel */}
      <div className="auth-visual">
        <div className="auth-visual-grid" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo">S</div>
          <div className="auth-visual-tagline">Join BusyBrainsMart</div>
          <p className="auth-visual-sub">
            Create your free account and start exploring millions of products.
          </p>
          <div className="auth-visual-features">
            {[
              'Free to join, no hidden fees',
              'Personalized product recommendations',
              'Track orders in real-time',
              'Exclusive member deals',
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
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">
              Already have one?{' '}
              <Link to="/login" style={{ color: 'var(--accent-red)', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Field name="fullName" label="Full Name" placeholder="John Doe" />
            <Field name="username" label="Username" placeholder="johndoe" autoComplete="username" />
            <Field name="email" label="Email Address" type="email" placeholder="john@example.com" />
            <Field name="password" label="Password" type="password" placeholder="Min. 6 characters" />
            <Field name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" />

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <div className="auth-divider-line" />
          </div>

          <button
            className="btn btn-google"
            type="button"
            onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google'; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
            By creating an account, you agree to our{' '}
            <span style={{ color: 'var(--accent-red)', cursor: 'pointer' }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: 'var(--accent-red)', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
