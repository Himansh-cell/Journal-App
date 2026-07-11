import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import { ShieldAlert, Users, Trash, RefreshCw, Plus, CheckCircle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create admin state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Cache state
  const [cacheSuccess, setCacheSuccess] = useState(false);
  const [cacheSubmitting, setCacheSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const allUsers = await adminAPI.getAllUsers();
      setUsers(allUsers || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user list. Make sure you have ADMIN authorization.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClearCache = async () => {
    setCacheSubmitting(true);
    setCacheSuccess(false);
    try {
      await adminAPI.clearCache();
      setCacheSuccess(true);
      setTimeout(() => setCacheSuccess(false), 3000);
    } catch (err) {
      alert('Failed to clear app cache.');
    } finally {
      setCacheSubmitting(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setCreateError('Please fill in all fields');
      return;
    }
    setCreateError('');
    setCreateSuccess('');
    setCreateSubmitting(true);

    try {
      await adminAPI.createAdminUser(adminUsername.trim(), adminPassword);
      setCreateSuccess(`Admin user "${adminUsername}" created successfully!`);
      setAdminUsername('');
      setAdminPassword('');
      fetchUsers(); // reload user list
    } catch (err) {
      console.error(err);
      setCreateError('Failed to create admin user. Username might be taken.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* Title */}
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldAlert size={28} className="color-primary" style={{ color: 'var(--secondary)' }} />
        <span>Admin Control Center</span>
      </h2>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', gridTemplateRows: 'auto' }}>
        
        {/* Row 1: Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Create Admin Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} style={{ color: 'var(--secondary)' }} />
              <span>Create Admin User</span>
            </h4>

            {createSuccess && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                {createSuccess}
              </div>
            )}

            {createError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={createSubmitting}
                style={{
                  backgroundColor: 'var(--secondary)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: createSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'var(--transition-smooth)',
                  boxShadow: '0 4px 12px var(--secondary-glow)',
                }}
              >
                {createSubmitting ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
          </div>

          {/* Configuration & Cache Manager */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={18} style={{ color: 'var(--secondary)' }} />
                <span>Configuration Cache</span>
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '20px' }}>
                The application configuration is cached in memory (such as weather API credentials from MongoDB). 
                If changes have been made to the database, trigger a cache reload below.
              </p>
            </div>

            <div>
              {cacheSuccess && (
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <CheckCircle size={14} />
                  <span>Cache cleared and reloaded!</span>
                </div>
              )}

              <button
                onClick={handleClearCache}
                disabled={cacheSubmitting}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '12px 18px',
                  cursor: cacheSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'var(--transition-smooth)',
                  width: '100%',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!cacheSubmitting) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'var(--secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!cacheSubmitting) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-card)';
                  }
                }}
              >
                <RefreshCw size={16} className={cacheSubmitting ? 'spin-anim' : ''} />
                <span>{cacheSubmitting ? 'Clearing Cache...' : 'Reload System Cache'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: User List */}
        <div className="glass-panel" style={{ padding: '32px', overflowX: 'auto' }}>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} style={{ color: 'var(--secondary)' }} />
            <span>Registered Application Users</span>
          </h4>

          {loading ? (
            <Spinner size="medium" />
          ) : error ? (
            <div style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</div>
          ) : users.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Username</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Roles</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Journals</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)' }} className="table-row-hover">
                    <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.username}</td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email || <i style={{ color: 'var(--text-muted)' }}>none</i>}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {u.roles?.map((role, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: role === 'ADMIN' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: role === 'ADMIN' ? 'var(--secondary)' : 'var(--primary)',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              border: `1px solid ${role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                            }}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                      {u.journalEntries?.length || 0} entries
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        color: u.sentiment ? 'var(--success)' : 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}>
                        {u.sentiment ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255,255,255,0.01);
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-anim {
          animation: rotate 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
