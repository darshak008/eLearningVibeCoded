import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await authAPI.getMe();
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {} finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
