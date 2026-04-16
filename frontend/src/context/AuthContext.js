import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gq_token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('gq_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('gq_token', token);
    return authAPI.getMe().then(res => { setUser(res.data); return res.data; });
  };

  const logout = () => {
    localStorage.removeItem('gq_token');
    setUser(null);
  };

  const refreshUser = () => {
    return authAPI.getMe().then(res => { setUser(res.data); return res.data; });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
