'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAuth } from '@/components/layout/auth-provider';
import { useRouter } from 'next/navigation';
import { IconShield, IconHome, IconArrowLeft } from '@tabler/icons-react';

export default function UnauthorizedPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleGoHome = () => {
    if (user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'admin':
        case 'super_admin':
          router.push('/dashboard/overview');
          break;
        case 'teacher':
          router.push('/teacher');
          break;
        case 'student':
          router.push('/student');
          break;
        case 'parent':
          router.push('/parent');
          break;
        default:
          router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
            <IconShield className='h-6 w-6 text-red-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-red-600'>
            Access Denied
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {user && (
            <div className='space-y-2 text-center'>
              <p className='text-muted-foreground text-sm'>
                Signed in as: <span className='font-medium'>{user.email}</span>
              </p>
              <p className='text-muted-foreground text-sm'>
                Current role:{' '}
                <span className='font-medium capitalize'>{user.role}</span>
              </p>
            </div>
          )}

          <div className='flex flex-col space-y-2'>
            <Button onClick={handleGoHome} className='w-full'>
              <IconHome className='mr-2 h-4 w-4' />
              Go to Dashboard
            </Button>

            <Button
              variant='outline'
              onClick={() => router.back()}
              className='w-full'
            >
              <IconArrowLeft className='mr-2 h-4 w-4' />
              Go Back
            </Button>

            {user && (
              <Button
                variant='destructive'
                onClick={handleSignOut}
                className='w-full'
              >
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
