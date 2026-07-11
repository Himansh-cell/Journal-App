import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Initialize and check token validity/fetch roles
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Parse token username (or decode JWT manually since it is simple)
          const username = extractUsernameFromToken(token);
          if (username) {
            const profile = await userAPI.getProfile(username);
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to validate token on load', err);
          // If token is expired or invalid, log out
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth-change events (fired by Axios interceptor)
    const handleAuthChange = () => {
      logout();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [token]);

  // Utility to parse username from JWT (payload is base64 encoded JSON)
  const extractUsernameFromToken = (jwtToken) => {
    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.sub || null;
    } catch (e) {
      console.error('Error parsing token payload', e);
      return null;
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const jwtToken = await authAPI.login(username, password);
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      
      const parsedUsername = extractUsernameFromToken(jwtToken) || username;
      const profile = await userAPI.getProfile(parsedUsername);
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return { success: true };
    } catch (err) {
      logout();
      const message = err.response?.data || 'Login failed. Please check credentials.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password, email) => {
    setLoading(true);
    try {
      await authAPI.signUp(username, password, email);
      return { success: true };
    } catch (err) {
      const message = err.response?.data || 'Sign up failed. Username might be taken.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user?.roles?.includes('ADMIN'),
    loading,
    login,
    register,
    logout,
    updateProfileState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
