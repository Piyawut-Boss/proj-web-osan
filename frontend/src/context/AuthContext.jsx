import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes idle → auto logout
const REFRESH_INTERVAL = 50 * 60 * 1000; // refresh token every 50 min (token lasts 2h)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef(null);
  const refreshTimer = useRef(null);

  const doLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setUser(null);
    clearTimeout(idleTimer.current);
    clearInterval(refreshTimer.current);
  }, []);

  // Reset idle timer on user activity
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    if (localStorage.getItem('admin_token')) {
      idleTimer.current = setTimeout(() => {
        doLogout();
        window.location.href = '/admin/login';
      }, IDLE_TIMEOUT);
    }
  }, [doLogout]);

  // Silently refresh the token
  const refreshToken = useCallback(async () => {
    try {
      const res = await api.post('/auth/refresh');
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
      }
    } catch {
      // Token expired or invalid → logout
      doLogout();
    }
  }, [doLogout]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      api.get('/auth/profile')
        .then(res => { if (res.data.success) setUser(res.data.data); })
        .catch(() => {
          localStorage.removeItem('admin_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Start idle timer + refresh interval when user is logged in
  useEffect(() => {
    if (user) {
      resetIdleTimer();
      refreshTimer.current = setInterval(refreshToken, REFRESH_INTERVAL);
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(e => window.addEventListener(e, resetIdleTimer));
      return () => {
        clearTimeout(idleTimer.current);
        clearInterval(refreshTimer.current);
        events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      };
    }
  }, [user, resetIdleTimer, refreshToken]);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'เกิดข้อผิดพลาด' };
    }
  };

  const logout = () => doLogout();

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
