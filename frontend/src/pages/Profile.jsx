import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Lock, Mail, ShieldAlert, Key, AlertTriangle, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfileState, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Edit fields
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await userAPI.updateProfile(username.trim(), password || null);
      
      // Since changing username or password affects authorization/session:
      setSuccess('Profile updated successfully! For security, please log in again.');
      
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to update profile. Username might be taken.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userAPI.deleteAccount();
      logout();
      navigate('/login');
    } catch (err) {
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px' }}>Account Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        {/* Left Column: Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h4
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <User size={20} className="color-primary" />
            <span>Profile Details</span>
          </h4>

          {success && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--success)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                marginBottom: '24px',
                border: '1px solid rgba(16, 185, 129, 0.15)',
              }}
            >
              {success}
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '0.9rem',
                marginBottom: '24px',
                border: '1px solid rgba(239, 68, 68, 0.15)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Email (read-only for display or editable if supported) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                >
                  <Mail size={18} />
                </span>
                <input
                  type="text"
                  disabled
                  value={user?.email || 'No email registered'}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '10px',
                    padding: '12px 14px 12px 44px',
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    cursor: 'not-allowed',
                  }}
                />
              </div>
            </div>

            {/* Password edit section */}
            <div
              style={{
                marginTop: '10px',
                borderTop: '1px solid var(--border-card)',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              <h5
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Key size={16} />
                <span>Change Password (Optional)</span>
              </h5>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                color: '#fff',
                borderRadius: '10px',
                padding: '14px 20px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                transition: 'var(--transition-smooth)',
                boxShadow: '0 4px 14px var(--primary-glow)',
                alignSelf: 'flex-start',
                marginTop: '10px',
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Settings'}
            </button>
          </form>
        </div>

        {/* Roles Box & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Roles */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h5
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="var(--success)" />
              <span>Assigned Security Roles</span>
            </h5>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {user?.roles?.map((role, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: role === 'ADMIN' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                    color: role === 'ADMIN' ? 'var(--secondary)' : 'var(--primary)',
                    border: `1px solid ${role === 'ADMIN' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.25)'}`,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="glass-panel"
            style={{
              padding: '32px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backgroundColor: 'rgba(239, 68, 68, 0.02)',
            }}
          >
            <h4
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--danger)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertTriangle size={20} />
              <span>Danger Zone</span>
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
              Once you delete your account, there is no going back. All of your saved journal entries will be
              permanently removed.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--danger)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--danger)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = 'var(--danger)';
                }}
              >
                Delete Account
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px dashed var(--danger)',
                  padding: '16px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Are you absolutely sure you want to delete your account?
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    disabled={isDeleting}
                    onClick={handleDeleteAccount}
                    style={{
                      backgroundColor: 'var(--danger)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-secondary)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
