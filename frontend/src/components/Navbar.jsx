/**
 * Navbar.jsx - Top navigation bar for authenticated pages.
 *
 * Shows:
 * - BusyBrainsMart logo
 * - User avatar + username + role badge
 * - Profile link
 * - Logout button
 * - Admin "Add Product" button (admin only)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onAddProduct }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.username?.slice(0, 2).toUpperCase() || '?';

  return (
    <nav className="navbar">
      {/* Logo */}
      <a href="/" className="navbar-logo">
        BB<span>Mart</span>
      </a>

      {/* Right side */}
      <div className="navbar-actions">
        {/* Admin-only: Add Product button */}
        {isAdmin() && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onAddProduct}
            style={{ width: 'auto' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Product
          </button>
        )}

        {/* Profile link */}
        <div className="navbar-user" onClick={() => navigate('/profile')}>
          <div className="navbar-avatar">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              initials
            )}
          </div>
          <span className="navbar-username">{user?.username}</span>
          <span className={`role-badge ${isAdmin() ? 'admin' : 'user'}`}>
            {isAdmin() ? 'Admin' : 'User'}
          </span>
        </div>

        {/* Logout button */}
        <button
          className="btn-icon"
          onClick={handleLogout}
          title="Logout"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
