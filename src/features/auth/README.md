# 🔐 Authentication Feature với Clerk + .NET API Integration

Feature authentication tích hợp Clerk với .NET API backend, hỗ trợ hybrid data strategy và role-based access control.

## 📁 Cấu trúc thư mục

```
src/features/auth/
├── services/
│   └── auth.service.ts         # Business logic, API calls, data transformation
├── hooks/
│   ├── use-auth.query.ts       # React Query hooks với query keys factory
│   └── useAuth.ts              # Combined user data hook
├── components/
│   ├── sign-in-view.tsx        # Trang đăng nhập với form validation
│   ├── sign-up-view.tsx        # Trang đăng ký
│   ├── user-auth-form.tsx      # Reusable auth form
│   └── google-auth-button.tsx  # OAuth button component
└── README.md                   # Tài liệu này
```

## 🚀 Cách sử dụng

### 1. Import hooks và services

```typescript
// Import hooks
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCurrentUserQuery } from '@/features/auth/hooks/use-auth.query';

// Import services
import { getUserBusinessData, combineUserData } from '@/features/auth/services/auth.service';
```

### 2. Sử dụng useAuth hook

```typescript
'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, isAuthenticated, isAdmin, redirectAfterAuth } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome {user?.full_name}</h1>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
      {isAdmin && <button>Admin Panel</button>}
    </div>
  );
}
```

### 3. Sử dụng React Query hook

```typescript
import { useCurrentUserQuery } from '@/features/auth/hooks/use-auth.query';

export default function UserProfile() {
  const { data: businessData, isLoading, error } = useCurrentUserQuery();

  if (isLoading) return <div>Loading user data...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h2>Business Data</h2>
      <p>Role: {businessData?.role}</p>
      <p>School ID: {businessData?.school_id}</p>
    </div>
  );
}
```

## 🔧 API Services

### `getUserBusinessData(userId, getToken)`
Fetch user business data từ .NET API.

```typescript
import { getUserBusinessData } from '@/features/auth/services/auth.service';
import { useAuth } from '@clerk/nextjs';

const { getToken } = useAuth();
const businessData = await getUserBusinessData(userId, getToken);
```

### `combineUserData(clerkUser, businessData)`
Kết hợp data từ Clerk và .NET API thành AuthUser object.

```typescript
import { combineUserData } from '@/features/auth/services/auth.service';

const combinedUser = combineUserData(clerkUser, businessData);
// Returns: AuthUser with all fields populated
```

## 🎯 Hybrid Data Strategy

**Tối ưu performance bằng cách kết hợp:**
- **Clerk data** (instant): Basic user info, auth state
- **.NET API data** (cached): Business roles, school info, permissions

```typescript
// ✅ Instant UI render với Clerk data
const { user: clerkUser } = useUser();

// ✅ Background fetch business data với caching
const { data: businessData } = useCurrentUserQuery();

// ✅ Combined object với full data
const combinedUser = combineUserData(clerkUser, businessData);
```

## 🔐 Authentication Flow

1. **Đăng nhập**: User login qua Clerk (email/password, OAuth)
2. **JWT Token**: Clerk cung cấp JWT token
3. **Business Data**: Fetch role/profile từ .NET API với JWT
4. **Combined User**: Merge Clerk + API data
5. **Route Protection**: Middleware check roles và redirect

## 🛡️ Role-Based Access Control

### Middleware Protection
```typescript
// src/middleware.ts
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',  // admin, super_admin only
  '/teacher(.*)',    // teacher only  
  '/student(.*)',    // student only
  '/parent(.*)'      // parent only
]);
```

### Component Protection
```typescript
const { user, isAdmin } = useAuth();

// Role-based rendering
{isAdmin && <AdminPanel />}
{user?.role === 'teacher' && <TeacherDashboard />}
```

## 📊 React Query Configuration

### Query Keys Factory Pattern
```typescript
// Organized query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  currentUser: () => [...authKeys.user(), 'current'] as const
};

// Usage
queryKey: [authKeys.currentUser(), user?.id]
```

### Caching Strategy
```typescript
{
  staleTime: 5 * 60 * 1000,  // 5 minutes fresh
  retry: false,              // No retry for user data
  enabled: !!user?.id        // Only run when user exists
}
```

## 🛠️ Configuration

### Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://54.79.247.75/api

# Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard/overview"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard/overview"
```

### .NET API Setup Required
- JWT validation với Clerk's public key
- User profile endpoints: `GET /User/{userId}`
- Role management system

## 📝 TypeScript Types

```typescript
export interface AuthUser {
  id: string;
  email: string;
  role: 'guest' | 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';
  full_name?: string;
  phone?: string;
  school_id?: string;
  created_at?: string;
}

export interface UserBusinessData {
  role?: 'guest' | 'teacher' | 'student' | 'parent' | 'admin' | 'super_admin';
  full_name?: string;
  phone?: string;
  school_id?: string;
  created_at?: string;
}

export interface ClerkUser {
  id: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  firstName?: string;
  lastName?: string;
  phoneNumbers?: Array<{ phoneNumber: string }>;
  createdAt?: string;
}
```

## 🔍 Troubleshooting

### Common Issues
1. **"server-only" import error**: Đã fix bằng cách tách client/server logic
2. **Token không có**: Check user đã login và `getToken()` function
3. **API 401**: Verify JWT validation trong .NET API
4. **Role redirect loop**: Check middleware logic và default roles

### Debug Tools
```typescript
// Log combined user data
const { user } = useAuth();
console.log('Combined user:', user);

// Check business data fetch
const { data, error } = useCurrentUserQuery();
console.log('Business data:', data, error);
```

## 🚀 Performance

- ✅ **Instant UI**: Clerk data renders immediately
- ✅ **Background fetch**: API data loads asynchronously  
- ✅ **Smart caching**: 5-minute stale time
- ✅ **No unnecessary calls**: Conditional queries
- ✅ **Type safety**: Full TypeScript coverage

## 📚 Tài liệu tham khảo

- [Clerk Next.js Documentation](https://clerk.com/docs/nextjs)
- [React Query Documentation](https://tanstack.com/query)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)