'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { RegisterFormData, registerSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  signUpWithEmail,
  saveAuthToken,
  saveUserData
} from '../services/auth.service';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUpViewPage({ stars }: { stars: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const { redirectAfterAuth, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 User already authenticated, redirecting...');
      router.push('/dashboard/overview'); // Or redirect based on role
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      console.log('📝 Attempting registration for:', data.email);

      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Call API register endpoint
      const { user, token, error } = await signUpWithEmail(
        data.email,
        data.password,
        firstName,
        lastName
      );

      if (error) {
        console.error('❌ Registration failed:', error.message);
        toast.error(error.message);
        return;
      }

      if (user && token) {
        console.log('✅ Registration successful:', {
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
        toast.success(`Welcome to EduPortal, ${user.full_name || user.email}!`);

        // Redirect based on user role
        redirectAfterAuth(user);
      } else {
        console.error('❌ Registration response missing user or token');
        toast.error('Registration failed: Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      {/* Left side - Branding */}
      <div className='relative hidden h-full flex-col overflow-hidden p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0'>
          <Image
            src='/FPT.jpg'
            alt='FPT Education Background'
            fill
            className='object-cover'
            priority
          />
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

        <div className='relative z-20 flex flex-1 items-center justify-center py-8'>
          <div className='space-y-6 text-center'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold text-white drop-shadow-lg'>
                Join EduPortal Today
              </h2>
              <p className='mx-auto max-w-md text-lg text-white/90 drop-shadow'>
                Create your account and start your educational journey with our
                comprehensive learning management system.
              </p>
            </div>
          </div>
        </div>

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-sm text-white/80 drop-shadow'>
              &ldquo;Education is the most powerful weapon which you can use to
              change the world.&rdquo;
            </p>
            <footer className='text-xs text-white/60'>Nelson Mandela</footer>
          </blockquote>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <div className='w-full space-y-6'>
            <div className='space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Create an account
              </h1>
              <p className='text-muted-foreground text-sm'>
                Enter your information below to create your account
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-4'
            >
              <div className='space-y-2'>
                <label htmlFor='fullName' className='text-sm font-medium'>
                  Full Name
                </label>
                <input
                  id='fullName'
                  type='text'
                  placeholder='John Doe'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={isLoading}
                  {...form.register('fullName')}
                />
                {form.formState.errors.fullName && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label htmlFor='email' className='text-sm font-medium'>
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  placeholder='your.email@example.com'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={isLoading}
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
                  placeholder='Create a strong password'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={isLoading}
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='confirmPassword'
                  className='text-sm font-medium'
                >
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm your password'
                  className='border-input bg-background focus:ring-primary w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none'
                  disabled={isLoading}
                  {...form.register('confirmPassword')}
                />
                {form.formState.errors.confirmPassword && (
                  <p className='text-sm text-red-500'>
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className='text-center'>
              <p className='text-muted-foreground text-sm'>
                Already have an account?{' '}
                <Link
                  href='/auth/sign-in'
                  className='text-primary hover:text-primary/90 font-medium underline underline-offset-4'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Terms and Privacy */}
          <p className='text-muted-foreground px-8 text-center text-sm'>
            By creating an account, you agree to our{' '}
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
