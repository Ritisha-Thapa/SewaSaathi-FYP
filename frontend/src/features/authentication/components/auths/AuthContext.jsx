import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const decodeTokenPayload = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const logout = useCallback(() => {
    clearTimeout(refreshTimerRef.current);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    localStorage.removeItem('first_name');
    setUser(null);
  }, []);

  // scheduleTokenRefresh decodes the JWT expiry, waits until 60s before expiry,
  // then silently calls the refresh endpoint and reschedules itself.
  const scheduleTokenRefresh = useCallback((accessToken) => {
    clearTimeout(refreshTimerRef.current);
    const payload = decodeTokenPayload(accessToken);
    if (!payload?.exp) return;

    const delay = payload.exp * 1000 - Date.now() - 60_000;

    const runRefresh = async () => {
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) { logout(); return; }
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/accounts/api/token/refresh/`,
          { refresh: refreshToken }
        );
        if (data?.access) {
          localStorage.setItem('access', data.access);
          scheduleTokenRefresh(data.access);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    if (delay <= 0) {
      runRefresh();
    } else {
      refreshTimerRef.current = setTimeout(runRefresh, delay);
    }
  }, [logout]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const access = localStorage.getItem('access');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('first_name');

    if (access) {
      setUser({ role, first_name: name });
      scheduleTokenRefresh(access);
    }
    setLoading(false);

    return () => clearTimeout(refreshTimerRef.current);
  }, [scheduleTokenRefresh]);

  const login = useCallback((data) => {
    const { token, user: userData } = data;
    localStorage.setItem('access', token.access);
    localStorage.setItem('refresh', token.refresh);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('first_name', userData.first_name);
    setUser(userData);
    scheduleTokenRefresh(token.access);
  }, [scheduleTokenRefresh]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
