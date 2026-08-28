// frontend/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { authService, AuthUser } from '../services/auth.service';

export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.me();
      if (res.authenticated && res.user) {
        setUser(res.user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : 'Gagal memverifikasi status autentikasi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = () => {
    authService.login();
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal logout.');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    authenticated,
    error,
    login,
    logout,
    refetch: checkAuth,
  };
}
