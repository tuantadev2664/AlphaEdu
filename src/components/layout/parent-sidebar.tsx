'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/components/layout/auth-provider';
import {
  IconUsers,
  IconCalendar,
  IconDashboard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconBook,
  IconMessageCircle,
  IconBell,
  IconChartBar
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

export default function ParentSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/auth/sign-in');
    }
  };

  if (loading || !user) {
    return (
      <Sidebar collapsible='icon'>
        <SidebarContent className='flex items-center justify-center'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (user.role !== 'parent') {
    return (
      <Sidebar collapsible='icon'>
        <SidebarContent className='flex items-center justify-center p-4'>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>Access denied</p>
            <p className='text-muted-foreground text-xs'>
              Parent role required
            </p>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  const parentNavItems = [
    {
      title: 'Dashboard',
      href: '/parent',
      icon: IconDashboard
    },
    {
      title: 'My Children',
      href: '/parent/children',
      icon: IconUsers
    },
    {
      title: 'Academic Reports',
      href: '/parent/reports',
      icon: IconChartBar
    },
    {
      title: 'Schedule',
      href: '/parent/schedule',
      icon: IconCalendar
    },
    {
      title: 'Messages',
      href: '/parent/messages',
      icon: IconMessageCircle
    },
    {
      title: 'Announcements',
      href: '/parent/announcements',
      icon: IconBell
    }
  ];

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-1'>
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
            <IconPhotoUp className='text-primary h-4 w-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>Parent Portal</span>
            <span className='text-muted-foreground truncate text-xs'>
              Education
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {parentNavItems.map((item) => (
              <SidebarMenuItem
                key={item.href}
                className={pathname === item.href ? 'bg-primary/10' : ''}
              >
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon className='h-4 w-4' />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={user.full_name || user.email}>
                <UserAvatarProfile
                  user={{
                    fullName: user.full_name || user.email,
                    emailAddresses: [{ emailAddress: user.email }]
                  }}
                />
                <div className='flex flex-col text-left'>
                  <span className='font-medium'>
                    {user.full_name || user.email}
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {user.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip='Sign Out'
                className='text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/20'
              >
                <IconLogout className='h-4 w-4' />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
