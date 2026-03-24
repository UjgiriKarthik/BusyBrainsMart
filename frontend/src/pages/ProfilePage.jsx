/**
 * ProfilePage.jsx - User profile management.
 *
 * Tabs:
 * - Profile Info: view and edit fullName, email, phone
 * - Security: change password (local accounts only)
 * - Account: account details, role info
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TABS = ['Profile Info', 'Security', 'Account'];

export default function ProfilePage() {
  const { user, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Profile Info');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await profileAPI.get();
      setProfile(data);
      setProfileForm({ fullName: data.fullName || '', email: data.email || '', phone: data.phone || '' });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await profileAPI.update(profileForm);
      // Update local user context with new name
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      login(token, { ...savedUser, fullName: profileForm.fullName, email: profileForm.email });
      toast.success('Profile updated successfully!');
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (pwForm.newPassword.length < 6) errs.newPassword = 'Password must be at least 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }

    setPwSaving(true);
    try {
      await profileAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwSaving(false);
    }
  };

  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : profile?.username?.slice(0, 2).toUpperCase() || '?';

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-screen" style={{ minHeight: 'calc(100vh - 68px)' }}>
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* Avatar card */}
          <div className="profile-card">
            <div className="profile-avatar-large">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.username} />
              ) : initials}
            </div>
            <div className="profile-name">{profile?.fullName || profile?.username}</div>
            <div className="profile-email">{profile?.email}</div>
            <span className={`role-badge ${isAdmin() ? 'admin' : 'user'}`} style={{ marginBottom: 4 }}>
              {isAdmin() ? '👑 Admin' : '👤 User'}
            </span>

            {profile?.provider && profile.provider !== 'local' && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                Signed in via <strong style={{ color: 'var(--text-secondary)' }}>{profile.provider}</strong>
              </div>
            )}

            {profile?.createdAt && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 12 }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`profile-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'Profile Info' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                  </svg>
                )}
                {tab === 'Security' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                )}
                {tab === 'Account' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M12 2v2M4.93 4.93l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M12 20v2m5.66-2.34l-1.41-1.41"/>
                  </svg>
                )}
                {tab}
              </button>
            ))}

            <button
              className="profile-nav-item"
              onClick={() => navigate('/')}
              style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 16 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Back to Shop
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="profile-main">

          {/* ── Profile Info Tab ── */}
          {activeTab === 'Profile Info' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Personal Information</h2>
              <form onSubmit={handleProfileSave}>
                <div className="profile-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input className="form-input" type="text" value={profile?.username || ''} disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Username cannot be changed</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="tel" value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      placeholder="you@example.com" />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-primary" type="submit" disabled={profileSaving}
                    style={{ width: 'auto', minWidth: 160 }}>
                    {profileSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Security Tab ── */}
          {activeTab === 'Security' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Change Password</h2>

              {profile?.provider && profile.provider !== 'local' ? (
                <div style={{ padding: '24px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 14 }}>
                  <p>🔒 Your account uses <strong>{profile.provider}</strong> for authentication.</p>
                  <p style={{ marginTop: 8 }}>Password management is handled by your identity provider.</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSave}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
                      { name: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                      { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
                    ].map(({ name, label, placeholder }) => (
                      <div className="form-group" key={name}>
                        <label className="form-label">{label}</label>
                        <input className="form-input" type="password" placeholder={placeholder}
                          value={pwForm[name]}
                          onChange={(e) => { setPwForm({ ...pwForm, [name]: e.target.value }); setPwErrors({ ...pwErrors, [name]: '' }); }} />
                        {pwErrors[name] && <p className="text-error">{pwErrors[name]}</p>}
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={pwSaving}
                    style={{ width: 'auto', minWidth: 180, marginTop: 8 }}>
                    {pwSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Account Tab ── */}
          {activeTab === 'Account' && (
            <div className="profile-section">
              <h2 className="profile-section-title">Account Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Account ID', value: profile?.id || 'N/A' },
                  { label: 'Username', value: profile?.username },
                  { label: 'Role', value: profile?.role === 'ROLE_ADMIN' ? '👑 Administrator' : '👤 Regular User' },
                  { label: 'Auth Provider', value: profile?.provider === 'local' || !profile?.provider ? '🔑 Local (username/password)' : `🌐 ${profile.provider} OAuth2` },
                  { label: 'Account Status', value: '✅ Active' },
                  { label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                  </div>
                ))}
              </div>

              {isAdmin() && (
                <div style={{
                  marginTop: 24, padding: 20, borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-red-dim)', border: '1px solid rgba(233,69,96,0.25)',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--accent-red)', fontWeight: 600, marginBottom: 6 }}>
                    👑 Admin Privileges
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    As an Admin, you can: add new products, edit existing products, delete products,
                    and access full catalog management via the dashboard.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
