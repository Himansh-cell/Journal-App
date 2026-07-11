import React, { useState, useEffect } from 'react';
import { journalAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import JournalCard from '../components/journal/JournalCard';
import JournalForm from '../components/journal/JournalForm';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import { Search, Plus, CloudSun, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [weather, setWeather] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch weather greeting
      try {
        const weatherText = await userAPI.getWeather();
        setWeather(weatherText);
      } catch (wErr) {
        console.error('Failed to load weather data', wErr);
        setWeather(`Hi ${user?.username}, welcome to your journal dashboard.`);
      }

      // 2. Fetch journal entries
      try {
        const journals = await journalAPI.getAll();
        setEntries(journals || []);
      } catch (jErr) {
        if (jErr.response && jErr.response.status === 404) {
          // If no entries, API returns 404 which is fine
          setEntries([]);
        } else {
          throw jErr;
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setError('Could not load journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateClick = () => {
    setFormMode('create');
    setSelectedEntry(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (entry) => {
    setFormMode('edit');
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleViewClick = (entry) => {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await journalAPI.delete(id);
        setEntries(prev => prev.filter(entry => entry.id !== id));
      } catch (err) {
        alert('Failed to delete entry');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === 'create') {
        const newEntry = await journalAPI.create(formData.title, formData.content);
        setEntries(prev => [newEntry, ...prev]);
      } else {
        const updatedEntry = await journalAPI.update(selectedEntry.id, formData.title, formData.content);
        setEntries(prev => prev.map(entry => (entry.id === selectedEntry.id ? updatedEntry : entry)));
      }
      setIsFormOpen(false);
      setSelectedEntry(null);
    } catch (err) {
      alert('Failed to save entry. Please try again.');
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const titleMatch = entry.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = entry.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Weather & Greeting Banner */}
      <div
        className="glass-panel glow-active"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px',
          marginBottom: '32px',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
          <CloudSun size={28} />
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {weather || 'Loading weather summary...'}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action button */}
          <button
            onClick={handleCreateClick}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              padding: '16px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              transition: 'var(--transition-smooth)',
              boxShadow: '0 4px 14px var(--primary-glow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Plus size={20} />
            <span>New Journal Entry</span>
          </button>

          {/* Search box */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Search Entries
            </h5>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keyword..."
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '10px',
                  padding: '10px 10px 10px 38px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-card)';
                }}
              />
            </div>
          </div>

          {/* Quick Info Box */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Journal Statistics
            </div>
            <div>Total Entries: <b>{entries.length}</b></div>
            <div>Matches Found: <b>{filteredEntries.length}</b></div>
          </div>
        </div>

        {/* Journals feed */}
        <div>
          {loading ? (
            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner size="large" />
            </div>
          ) : error ? (
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'center',
                border: '1px dashed var(--danger)',
              }}
            >
              <AlertCircle size={36} color="var(--danger)" />
              <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Error Loading Logs</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</div>
              <button
                onClick={fetchDashboardData}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Retry
              </button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '16px',
                minHeight: '300px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <MessageSquare size={28} />
              </div>
              <div>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px' }}>
                  No Journal Entries
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '350px' }}>
                  {searchQuery
                    ? 'No entries match your search query. Try clearing the filter.'
                    : "You haven't written any journal entries yet. Click 'New Journal Entry' to begin!"}
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {filteredEntries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEntry(null);
        }}
        title={formMode === 'create' ? 'Create Journal Entry' : 'Edit Journal Entry'}
      >
        <JournalForm
          initialData={selectedEntry}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedEntry(null);
          }}
          submitLabel={formMode === 'create' ? 'Create' : 'Save Changes'}
        />
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedEntry(null);
        }}
        title={selectedEntry?.title || 'View Journal'}
      >
        {selectedEntry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              <Calendar size={14} />
              <span>
                {new Date(selectedEntry.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div
              style={{
                color: 'var(--text-primary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '12px 0',
                borderTop: '1px solid var(--border-card)',
              }}
            >
              {selectedEntry.content || <i style={{ color: 'var(--text-muted)' }}>No content written.</i>}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                borderTop: '1px solid var(--border-card)',
                paddingTop: '16px',
                gap: '12px',
              }}
            >
              <button
                onClick={() => {
                  setIsViewOpen(false);
                  handleEditClick(selectedEntry);
                }}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                Edit Entry
              </button>
              <button
                onClick={() => setIsViewOpen(false)}
                style={{
                  backgroundColor: 'var(--primary)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
