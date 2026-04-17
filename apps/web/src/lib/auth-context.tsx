'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  api,
  setTokens,
  clearTokens,
  getSavedRefresh,
} from './api';

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    async function restore() {
      const saved = getSavedRefresh();
      if (!saved) {
        setLoading(false);
        return;
      }

      try {
        const res = await api('/auth/refresh', {
          method: 'POST',
          body: JSON.stringify(saved),
        });

        if (res.ok) {
          const data = await res.json();
          setTokens(data.accessToken, data.refreshToken, saved.userId);

          // Fetch user info
          const meRes = await api('/auth/me', { method: 'POST' });
          if (meRes.ok) {
            const meData = await meRes.json();
            setUser(meData);
          }
        } else {
          clearTokens();
        }
      } catch {
        clearTokens();
      }

      setLoading(false);
    }

    restore();
  }, []);

  async function login(email: string, password: string) {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken, data.user.id);
    setUser(data.user);
  }

  async function register(
    email: string,
    username: string,
    password: string,
    role?: string,
  ) {
    const res = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, role }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken, data.user.id);
    setUser(data.user);
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      // Logout even if API call fails
    }
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}