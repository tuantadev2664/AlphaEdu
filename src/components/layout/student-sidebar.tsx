'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useAuth } from '@/components/layout/auth-provider';
import {
  IconHome,
  IconAward,
  IconBell,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconCalendar,
  IconBook
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

export const studentCompany = {
  name: 'Student Portal',
  logo: IconPhotoUp,
  plan: 'Education'
};

// Student navigation items
const studentNavItems = [
  {
    title: 'Dashboard',
    url: '/student',
    icon: IconHome,
    isActive: true
  },
  {
    title: 'My Grades',
    url: '/student/grades',
    icon: IconAward,
    isActive: false
  },
  {
    title: 'Schedule',
    url: '/student/schedule',
    icon: IconCalendar,
    isActive: false
  },
  {
    title: 'Assignments',
    url: '/student/assignments',
    icon: IconBook,
    isActive: false
  },
  {
    title: 'Announcements',
    url: '/student/announcements',
    icon: IconBell,
    isActive: false
  }
];

export default function StudentSidebar() {
  const pathname = usePathname();
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

  // Don't render sidebar if no user or loading
  if (loading || !user) {
    return (
      <Sidebar collapsible='icon'>
        <SidebarContent className='flex items-center justify-center'>
          <div className='border-primary h-8 w-8 animate-spin rounded-full border-b-2'></div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Only allow students to use this sidebar
  if (user.role !== 'student') {
    return (
      <Sidebar collapsible='icon'>
        <SidebarContent className='flex items-center justify-center p-4'>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>Access denied</p>
            <p className='text-muted-foreground text-xs'>
              Student role required
            </p>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-1'>
          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg'>
            <studentCompany.logo className='text-primary h-4 w-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {studentCompany.name}
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              {studentCompany.plan}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {studentNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon className='h-4 w-4' />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex items-center gap-2 px-2 py-1.5'>
              <UserAvatarProfile
                user={{
                  fullName: user.full_name || user.email,
                  emailAddresses: [{ emailAddress: user.email }]
                }}
                className='h-8 w-8'
              />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {user.full_name || user.email}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {user.email}
                </span>
              </div>
            </div>
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
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
