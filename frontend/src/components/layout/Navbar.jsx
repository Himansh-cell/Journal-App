import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { BookOpen, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--bg-secondary)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-card)',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'var(--transition-smooth)',
      }}
    >
      {/* Brand logo */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontSize: '1.35rem',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--primary)',
            color: '#fff',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-glow)',
          }}
        >
          <BookOpen size={20} />
        </div>
        <span>
          My<span style={{ color: 'var(--primary)' }}>Journal</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link
          to="/"
          style={{
            color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/')) e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/')) e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <BookOpen size={16} />
          <span>Journals</span>
        </Link>

        <Link
          to="/profile"
          style={{
            color: isActive('/profile') ? 'var(--primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => {
            if (!isActive('/profile')) e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            if (!isActive('/profile')) e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <UserIcon size={16} />
          <span>Profile</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            style={{
              color: isActive('/admin') ? 'var(--secondary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)',
            }}
            onMouseEnter={(e) => {
              if (!isActive('/admin')) e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              if (!isActive('/admin')) e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <ShieldAlert size={16} />
            <span>Admin</span>
          </Link>
        )}
      </div>

      {/* Settings / Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-card)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isAdmin ? 'Admin User' : 'Standard User'}
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
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
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
