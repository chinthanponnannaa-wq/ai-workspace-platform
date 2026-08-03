import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile on initial load if token exists in localStorage
  useEffect(() => {
    const fetchProfileOnLoad = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authApi.getProfile();
          if (res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setAuthChecking(false);
    };

    fetchProfileOnLoad();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const data = response.data;
      if (data && data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data?.message || 'Invalid credentials');
        setLoading(false);
        return false;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      setLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register({ name, email, password });
      const data = response.data;
      if (data && data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setLoading(false);
        return true;
      } else {
        setError(data?.message || 'Registration failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authChecking,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
