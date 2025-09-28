'use client';

import { useAuth } from '@/components/layout/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

export function RouteGuard({
  children,
  allowedRoles = [],
  requireAuth = true,
  fallbackPath = '/auth/sign-in',
  loadingComponent,
  unauthorizedComponent
}: RouteGuardProps) {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      console.log('🚫 Authentication required, redirecting to:', fallbackPath);
      router.push(fallbackPath);
      return;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && user) {
      const hasAccess = hasRole(allowedRoles);
      if (!hasAccess) {
        console.log(
          '🚫 Access denied for role:',
          user.role,
          'Required:',
          allowedRoles
        );
        router.push('/auth/unauthorized');
        return;
      }
    }

    console.log('✅ Route access granted');
  }, [
    user,
    loading,
    isAuthenticated,
    requireAuth,
    allowedRoles,
    router,
    fallbackPath,
    hasRole
  ]);

  // Show loading state
  if (loading) {
    return (
      loadingComponent || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='space-y-4 text-center'>
            <div className='border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2'></div>
            <p className='text-muted-foreground text-sm'>Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Block access if not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Block access if role not allowed
  if (allowedRoles.length > 0 && user && !hasRole(allowedRoles)) {
    return (
      unauthorizedComponent || (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='space-y-4 text-center'>
            <h1 className='text-2xl font-bold text-red-600'>Access Denied</h1>
            <p className='text-muted-foreground'>
              You don&apos;t have permission to access this page.
            </p>
            <p className='text-muted-foreground text-sm'>
              Required roles: {allowedRoles.join(', ')}
            </p>
            <p className='text-muted-foreground text-sm'>
              Your role: {user?.role}
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Specialized route guards for common use cases

export function AdminOnlyGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={['admin', 'super_admin']}>{children}</RouteGuard>
  );
}

export function TeacherOnlyGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['teacher']}>{children}</RouteGuard>;
}

export function StudentOnlyGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['student']}>{children}</RouteGuard>;
}

export function ParentOnlyGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['parent']}>{children}</RouteGuard>;
}

export function AuthRequiredGuard({ children }: { children: React.ReactNode }) {
  return <RouteGuard requireAuth={true}>{children}</RouteGuard>;
}
