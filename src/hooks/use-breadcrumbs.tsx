'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  // Student routes
  '/student': [{ title: 'Student Dashboard', link: '/student' }],
  // Teacher routes
  '/teacher': [{ title: 'Teacher Dashboard', link: '/teacher' }],
  '/teacher/classes': [
    { title: 'Teacher Dashboard', link: '/teacher' },
    { title: 'Classes', link: '/teacher/classes' }
  ],
  '/teacher/inbox': [
    { title: 'Teacher Dashboard', link: '/teacher' },
    { title: 'Inbox', link: '/teacher/inbox' }
  ],
  // Parent routes
  '/parent': [{ title: 'Parent Dashboard', link: '/parent' }],
  '/parent/children': [
    { title: 'Parent Dashboard', link: '/parent' },
    { title: 'My Children', link: '/parent/children' }
  ],
  '/parent/messages': [
    { title: 'Parent Dashboard', link: '/parent' },
    { title: 'Messages', link: '/parent/messages' }
  ],
  '/parent/reports': [
    { title: 'Parent Dashboard', link: '/parent' },
    { title: 'Academic Reports', link: '/parent/reports' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
