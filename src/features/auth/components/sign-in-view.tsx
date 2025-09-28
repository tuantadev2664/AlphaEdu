'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { loginSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData } from '@/lib/validations';
import { useState, useEffect } from 'react';
import {
  signInWithEmail,
  saveAuthToken,
  saveUserData,
  getRedirectPath
} from '../services/auth.service';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignInViewPage({ stars }: { stars: number }) {
  const [loading, setLoading] = useState(false);
  const { redirectAfterAuth, isAuthenticated, updateUser, user } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(
        '🔄 User already authenticated:',
        user.email,
        'Role:',
        user.role
      );

      // Redirect dựa trên role cụ thể
      const redirectPath = getRedirectPath(user.role);
      console.log('🔄 Redirecting to:', redirectPath);

      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      console.log('🔐 Attempting login for:', data.email);

      // Call API login endpoint
      const { user, token, error } = await signInWithEmail(
        data.email,
        data.password
      );

      if (error) {
        console.error('❌ Login failed:', error.message);
        toast.error(error.message);
        return;
      }

      if (user && token) {
        console.log('✅ Login successful:', {
          email: user.email,
          role: user.role,
          hasToken: !!token
        });

        // Save JWT token to secure cookie
        saveAuthToken(token);
        console.log('🔑 JWT token saved');

        // Save user data to localStorage
        saveUserData(user);
        console.log('💾 User data saved');

        // Update auth context
        updateUser(user);

        // Show success message
        toast.success(`Welcome back, ${user.full_name || user.email}!`);

        // Redirect based on user role
        // redirectAfterAuth(user);
      } else {
        console.error('❌ Login response missing user or token');
        toast.error('Login failed: Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error(
        'Failed to login. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.info('Google Sign-In will be implemented soon');
    // TODO: Implement Google OAuth with your own backend
    // For now, show message that it's not available
  };

  // Show loading state if checking authentication
  if (isAuthenticated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground mt-2 text-sm'>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Login
      </Link> */}
      <div className='relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex dark:border-r'>
        {/* Background Image */}
        <div className='absolute inset-0'>
          <Image
            src='/FPT.jpg'
            alt='FPT Education Background'
            fill
            className='object-cover'
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className='absolute inset-0 bg-black/50' />
        </div>

        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image
            src='/Logo.png'
            alt='logo'
            width={100}
            height={100}
            className='mr-5 rounded-full'
          />
          <span className='font-semibold text-white'>EduPortal</span>
        </div>

        {/* Content overlay */}
        <div className='relative z-20 flex flex-1 items-center justify-center py-8'>
          <div className='space-y-6 text-center'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold text-white drop-shadow-lg'>
                Welcome to Alpha EduPortal
              </h2>
              <p className='mx-auto max-w-md text-lg text-white/90 drop-shadow'>
                Empowering education through technology. Connect, learn, and
                grow with our comprehensive learning management system.
              </p>
            </div>
          </div>
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-sm text-white/80 drop-shadow'>
              &ldquo;Transforming education through innovative technology
              solutions. Connect, learn, and grow with our comprehensive
              learning management system.&rdquo;
            </p>
            <footer className='text-xs text-white/60'>
              FPT EduPortal Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          {/* Sign In Form */}
          <div className='w-full space-y-6'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Welcome back
              </h1>
              <p className='text-muted-foreground text-sm'>
                Enter your email and password to sign in to your account
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  placeholder='your.email@example.com'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={loading}
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label htmlFor='password' className='text-sm font-medium'>
                  Password
                </label>
                <input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={loading}
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={loading}
                className='bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
              >
                {loading ? (
                  <div className='flex items-center justify-center'>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background text-muted-foreground px-2'>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button (Disabled for now) */}
            <button
              type='button'
              onClick={handleGoogleSignIn}
              disabled={false} // Disabled until implemented
              className='border-input bg-background hover:bg-accent hover:text-accent-foreground flex h-10 w-full items-center justify-center gap-2 rounded-md border px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50'
            >
              <svg className='h-4 w-4' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/auth/sign-up'
                  className='text-primary hover:text-primary/90 font-medium underline underline-offset-4'
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Terms and Privacy */}
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
