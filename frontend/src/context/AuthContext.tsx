import React, { createContext, ReactNode, useContext, useMemo, useState, useEffect } from 'react';
import { api, ApiUser, USER_KEY } from '../services/api';

interface AuthContextValue {
  user: ApiUser | null;
  token: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ email: string }>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, password: string) => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  localStorage.removeItem('adaptive_workspace_token');
  const [token, setToken] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.me().then((currentUser) => {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      setUser(currentUser);
      setToken(true);
    }).catch(() => localStorage.removeItem(USER_KEY)).finally(() => setReady(true));
  }, []);

  const saveSession = (nextUser: ApiUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(true);
    setUser(nextUser);
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: token,
    signIn: async (email: string, password: string) => {
      const result = await api.login(email, password);
      saveSession(result.user);
    },
    register: async (name: string, email: string, password: string) => {
      const result = await api.register(name, email, password);
      return { email: result.email };
    },
    verifyEmail: async (email: string, code: string) => {
      const result = await api.verifyEmail(email, code);
      saveSession(result.user);
    },
    resendVerification: async (email: string) => { await api.resendVerification(email); },
    forgotPassword: async (email: string) => { await api.forgotPassword(email); },
    resetPassword: async (email: string, code: string, password: string) => { await api.resetPassword(email, code, password); },
    updateProfile: async (data: { name?: string; email?: string }) => {
      const result = await api.updateProfile(data);
      localStorage.setItem(USER_KEY, JSON.stringify(result));
      setUser(result);
    },
    deleteAccount: async () => {
      await api.deleteAccount();
      localStorage.removeItem(USER_KEY);
      setToken(false);
      setUser(null);
    },
    signOut: () => {
      localStorage.removeItem(USER_KEY);
      setToken(false);
      setUser(null);
    }
  }), [token, user]);

  if (!ready) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
