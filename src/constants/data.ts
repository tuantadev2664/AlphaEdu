import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];

// Teacher navigation items
export const teacherNavItems: NavItem[] = [
  {
    title: 'Teacher Dashboard',
    url: '/teacher',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['t', 'd'],
    items: []
  },
  {
    title: 'All Classes',
    url: '/teacher/classes',
    icon: 'graduationCap',
    isActive: true,
    shortcut: ['t', 'c'],
    items: []
  },
  {
    title: 'Inbox',
    url: '/teacher/inbox',
    icon: 'mail',
    shortcut: ['t', 'i'],
    isActive: false,
    items: []
  },
  {
    title: 'Assignments',
    url: '/teacher/assignments',
    icon: 'fileText',
    shortcut: ['t', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Reports',
    url: '#',
    icon: 'barChart3',
    isActive: false,
    items: [
      {
        title: 'Grade Reports',
        url: '/teacher/reports/grades',
        icon: 'award'
      },
      {
        title: 'Behavior Reports',
        url: '/teacher/reports/behavior',
        icon: 'star'
      },
      {
        title: 'Attendance',
        url: '/teacher/reports/attendance',
        icon: 'calendar'
      }
    ]
  },
  {
    title: 'Settings',
    url: '/teacher/settings',
    icon: 'settings',
    shortcut: ['t', 's'],
    isActive: false,
    items: []
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
