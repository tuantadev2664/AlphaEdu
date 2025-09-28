'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../services/auth.service';

export default function GithubSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      ) : (
        <Icons.google className='mr-2 h-4 w-4' />
      )}
      Continue with Google
    </Button>
  );
}
