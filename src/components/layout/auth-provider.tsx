'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/features/auth/hooks/useAuth';
import { AuthUser } from '@/features/auth/services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  initializing: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  redirectAfterAuth: (user: AuthUser) => void;
  refreshUser: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
  hasRole: (roles: string | string[]) => boolean;
  refetchUser: () => void;
  queryError: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
