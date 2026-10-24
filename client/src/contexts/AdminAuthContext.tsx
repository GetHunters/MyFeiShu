import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { adminApi } from '@client/src/api';

const STORAGE_KEY = 'admin_logged_in';

interface AdminAuthContextValue {
  isLoggedIn: boolean;
  login: (account: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isHydrated = useRef(false);

  useEffect(() => {
    const stored = safeGetItem(STORAGE_KEY);
    if (stored === 'true') {
      setIsLoggedIn(true);
    }
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    safeSetItem(STORAGE_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const login = useCallback(async (account: string, password: string): Promise<boolean> => {
    try {
      const result = await adminApi.adminLogin(account, password);
      if (result.success) {
        setIsLoggedIn(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({ isLoggedIn, login, logout }),
    [isLoggedIn, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
