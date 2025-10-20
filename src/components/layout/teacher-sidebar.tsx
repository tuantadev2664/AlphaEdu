'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { teacherNavItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/components/layout/auth-provider';
import { useClassDetails } from '@/features/class/hooks/use-class.query';
import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconUsers,
  IconAward,
  IconStar,
  IconCalendar
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';

export const teacherCompany = {
  name: 'Cổng Giáo Viên',
  logo: IconPhotoUp,
  plan: 'Giáo Dục'
};

const tenants = [
  { id: '1', name: 'Trường Của Tôi' },
  { id: '2', name: 'Văn Phòng Quận' }
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  const activeTenant = tenants[0];

  // Check if we're in a class detail page
  const classMatch = pathname.match(/\/teacher\/classes\/([^\/]+)/);
  const currentClassId = classMatch ? classMatch[1] : null;

  // Fetch class details using the hook
  const { data: currentClass, isLoading: classLoading } = useClassDetails(
    {
      classId: currentClassId || '',
      academicYearId: '22222222-2222-2222-2222-222222222222'
    },
    {
      enabled: !!currentClassId
    }
  );

  // Class navigation tabs
  const classTabConfigs = currentClass
    ? [
        {
          value: 'overview',
          label: 'Tổng Quan',
          icon: IconUsers,
          url: `/teacher/classes/${currentClassId}`
        },
        {
          value: 'roster',
          label: 'Danh Sách',
          icon: IconUsers,
          url: `/teacher/classes/${currentClassId}/roster`
        },
        {
          value: 'gradebook',
          label: 'Sổ Điểm',
          icon: IconAward,
          url: `/teacher/classes/${currentClassId}/gradebook`
        },
        {
          value: 'behavior',
          label: 'Hành Vi',
          icon: IconStar,
          url: `/teacher/classes/${currentClassId}/behavior`
        },
        {
          value: 'announcements',
          label: 'Thông Báo',
          icon: IconCalendar,
          url: `/teacher/classes/${currentClassId}/announcements`
        }
      ]
    : [];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      router.push('/auth/sign-in');
    }
  };

  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching functionality would be implemented here
    console.log('Switching to tenant:', _tenantId);
  };

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

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

  // Only allow teachers to use this sidebar
  if (user.role !== 'teacher') {
    return (
      <Sidebar collapsible='icon'>
        <SidebarContent className='flex items-center justify-center p-4'>
          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>Truy cập bị từ chối</p>
            <p className='text-muted-foreground text-xs'>
              Yêu cầu quyền giáo viên
            </p>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          defaultTenant={activeTenant}
          onTenantSwitch={handleSwitchTenant}
        />
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        {/* Class Navigation - Show when in class detail */}
        {currentClassId && (
          <SidebarGroup>
            <SidebarGroupLabel>
              {classLoading ? (
                <div className='bg-muted h-4 w-16 animate-pulse rounded' />
              ) : (
                currentClass?.className || 'Lớp Học'
              )}
            </SidebarGroupLabel>
            <SidebarMenu>
              {classTabConfigs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SidebarMenuItem key={tab.value}>
                    <SidebarMenuButton
                      asChild
                      tooltip={tab.label}
                      isActive={
                        pathname === tab.url ||
                        (tab.value === 'overview' &&
                          pathname === `/teacher/classes/${currentClassId}`)
                      }
                    >
                      <Link href={tab.url}>
                        <Icon className='h-4 w-4' />
                        <span>{tab.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Cổng Giáo Viên</SidebarGroupLabel>
          <SidebarMenu>
            {teacherNavItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <UserAvatarProfile
                    className='h-8 w-8 rounded-lg'
                    showInfo
                    user={{
                      fullName: user.full_name || user.email,
                      emailAddresses: [{ emailAddress: user.email }]
                    }}
                  />
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={{
                        fullName: user.full_name || user.email,
                        emailAddresses: [{ emailAddress: user.email }]
                      }}
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/teacher/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Hồ Sơ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/teacher/schedule')}
                  >
                    <IconCalendar className='mr-2 h-4 w-4' />
                    Lịch Trình
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/teacher/settings')}
                  >
                    <IconBell className='mr-2 h-4 w-4' />
                    Cài Đặt
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className='text-red-600 focus:text-red-600'
                >
                  <IconLogout className='mr-2 h-4 w-4' />
                  Đăng Xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
