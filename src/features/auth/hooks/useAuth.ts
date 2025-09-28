'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  AuthUser,
  getRedirectPath
} from '@/features/auth/services/auth.service';
import { useCurrentUserQuery } from '@/features/auth/hooks/use-auth.query';
import * as authService from '@/features/auth/services/auth.service';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Query để validate token và lấy user data
  const {
    data: queryUser,
    isLoading: queryLoading,
    error: queryError,
    refetch: refetchUser
  } = useCurrentUserQuery();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth state...');

        // Kiểm tra stored user data trước
        const storedUser = authService.getUserData();
        const token = authService.getAuthToken();

        if (storedUser && token) {
          console.log('📦 Found stored user:', storedUser.email);
          setUser(storedUser);
          setInitializing(false);

          // Background validation với React Query
          return;
        }

        // Nếu không có stored data, đợi React Query validate
        if (!token) {
          console.log('❌ No token found');
          setUser(null);
          setInitializing(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setUser(null);
        setInitializing(false);
      }
    };

    initAuth();
  }, []);

  // Update user state khi React Query data thay đổi
  useEffect(() => {
    if (queryUser) {
      setUser(queryUser);
      setInitializing(false);
    } else if (!queryLoading && !initializing) {
      // Query đã chạy xong nhưng không có user
      setUser(null);
    }
  }, [queryUser, queryLoading, initializing]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      console.error('❌ Auth query error:', queryError);
      setUser(null);
      setInitializing(false);
    }
  }, [queryError]);

  // Redirect after successful authentication
  const redirectAfterAuth = useCallback(
    (user: AuthUser) => {
      const redirectPath = getRedirectPath(user.role);
      console.log('🔄 Redirecting to:', redirectPath, 'for role:', user.role);
      router.push(redirectPath);
    },
    [router]
  );

  // Manual refresh user data
  const refreshUser = useCallback(async () => {
    try {
      console.log('🔄 Refreshing user data...');
      const freshUser = await authService.refreshUserData();
      if (freshUser) {
        setUser(freshUser);
        // Trigger React Query refetch
        refetchUser();
      }
      return freshUser;
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
      return null;
    }
  }, [refetchUser]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      console.log('👋 Signing out...');
      setUser(null);
      await authService.signOut();
      // signOut() function đã handle redirect
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Force redirect even if API call fails
      authService.clearAuthToken();
      authService.clearUserData();
      setUser(null);
      router.push('/auth/sign-in');
    }
  }, [router]);

  // Check if user has specific role(s)
  const hasRole = useCallback(
    (roles: string | string[]) => {
      return authService.hasRole(user, roles);
    },
    [user]
  );

  // Update user data (for profile updates, etc.)
  const updateUser = useCallback(
    (updatedUser: AuthUser) => {
      setUser(updatedUser);
      authService.saveUserData(updatedUser);
      // Optionally trigger refetch
      refetchUser();
    },
    [refetchUser]
  );

  // Check if currently loading
  const loading = initializing || queryLoading;

  // Check authentication status
  const isAuthenticated = !!user && authService.isAuthenticated();

  // Check admin status
  const isAdmin = hasRole(['admin', 'super_admin']);

  return {
    // User data
    user,

    // Loading states
    loading,
    initializing,

    // Authentication status
    isAuthenticated,
    isAdmin,

    // Actions
    redirectAfterAuth,
    refreshUser,
    signOut,
    updateUser,

    // Utilities
    hasRole,

    // React Query utilities
    refetchUser,
    queryError
  };
}

// Hook để check authentication và redirect nếu cần
export function useRequireAuth(redirectTo: string = '/auth/sign-in') {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🚫 Authentication required, redirecting to:', redirectTo);
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { isAuthenticated, loading };
}

// Hook để check role và redirect nếu không có quyền
export function useRequireRole(
  allowedRoles: string | string[],
  redirectTo: string = '/auth/unauthorized'
) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const hasAccess = hasRole(allowedRoles);
      if (!hasAccess) {
        console.log(
          '🚫 Access denied for role:',
          user.role,
          'Required:',
          allowedRoles
        );
        router.push(redirectTo);
      }
    }
  }, [user, loading, allowedRoles, redirectTo, hasRole, router]);

  return { user, loading, hasAccess: hasRole(allowedRoles) };
}
