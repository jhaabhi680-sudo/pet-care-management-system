import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session in localStorage when component mounts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('petCareUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse stored user:', err);
      localStorage.removeItem('petCareUser');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('petCareUser', JSON.stringify(data));
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    setUser(data);
    localStorage.setItem('petCareUser', JSON.stringify(data));
    return data;
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('petCareUser');
  };

  // Update profile in state and storage
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('petCareUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'veterinarian',
        isOwner: user?.role === 'owner',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
