'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useAuth } from '@/components/layout/auth-provider';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
        <div className='border-primary h-4 w-4 animate-spin rounded-full border-b-2'></div>
      </Button>
    );
  }

  // Don't render if no user
  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      // signOut() already handles redirect
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if error
      router.push('/auth/sign-in');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <UserAvatarProfile
            user={{
              fullName: user.full_name || user.email,
              emailAddresses: [{ emailAddress: user.email }]
            }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        sideOffset={10}
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {user.full_name || user.email}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
            <p className='text-muted-foreground text-xs leading-none capitalize'>
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            Settings
          </DropdownMenuItem>
          {user.role === 'admin' || user.role === 'super_admin' ? (
            <DropdownMenuItem onClick={() => router.push('/dashboard/team')}>
              Team Management
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className='text-red-600 focus:text-red-600'
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
