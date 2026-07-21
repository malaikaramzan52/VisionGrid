import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'vg_user';
const TOKEN_KEY   = 'vg_token';

function getStoredUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) return null;
    return getStoredUser();
  });

  /* Sign up — returns null on success, error string on failure */
  const signUp = useCallback(async ({ name, email, password }) => {
    try {
      await api.post('/auth/signup', { name, email, password });
      return null;
    } catch (err) {
      return err.response?.data?.message || 'Registration failed.';
    }
  }, []);

  /* Login — returns null on success, error string on failure */
  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: rawUser } = res.data;

      // Normalize user object — map created_at → joinedAt
      const userDetails = {
        ...rawUser,
        joinedAt: rawUser.joinedAt || rawUser.created_at || new Date().toISOString(),
      };

      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userDetails));

      setToken(jwtToken);
      setUser(userDetails);
      return null;
    } catch (err) {
      return err.response?.data?.message || 'Invalid email or password.';
    }
  }, []);

  /* Logout */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /* Update profile - local display update */
  const updateProfile = useCallback(({ name, email, avatar }) => {
    if (!user) return 'User not logged in.';
    const updated = { ...user, name, email, avatar: avatar ?? user.avatar };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
    return null;
  }, [user]);

  /* Change password - local placeholder */
  const changePassword = useCallback(({ currentPassword, newPassword }) => {
    return null;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signUp, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
