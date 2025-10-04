import { useQuery } from '@tanstack/react-query';
import * as authService from '@/features/auth/services/auth.service';

// Query keys factory
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  currentUser: () => [...authKeys.user(), 'current'] as const,
  validateToken: () => [...authKeys.all, 'validate'] as const
};

// Query để validate JWT token và lấy user data
export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      // Kiểm tra token có tồn tại không
      const token = authService.getAuthToken();
      if (!token) {
        console.log('❌ No token found');
        return null;
      }

      // Validate token với API
      const user = await authService.validateToken(token);
      if (user) {
        console.log('✅ User validated:', user.email);
      } else {
        console.log('❌ Token validation failed, user will be cleared');
      }

      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: (failureCount, error) => {
      // Không retry nếu là lỗi authentication hoặc token hết hạn
      if (
        error instanceof Error &&
        (error.message.includes('Authentication') ||
          error.message.includes('expired') ||
          error.message.includes('401'))
      ) {
        return false;
      }
      return failureCount < 1; // Chỉ retry 1 lần
    },
    refetchOnWindowFocus: false, // Tắt refetch khi focus (tránh redirect liên tục)
    refetchOnMount: true,
    throwOnError: false,
    // Thêm timeout cho production
    meta: {
      timeout: 10000 // 10 seconds timeout
    }
  });
}

// Query để refresh user data
export function useRefreshUserQuery() {
  return useQuery({
    queryKey: [...authKeys.user(), 'refresh'],
    queryFn: () => authService.refreshUserData(),
    enabled: false, // Chỉ chạy khi manually trigger
    staleTime: 0 // Always fresh when called
  });
}

export function useUserByIdQuery(userId: string) {
  return useQuery({
    queryKey: [...authKeys.user(), 'userById', userId],
    queryFn: () => authService.getUserById(userId),
    enabled: !!userId
  });
}

// Mutation để login (có thể dùng với React Query mutations)
export function useLoginMutation() {
  // Sẽ implement trong bước tiếp theo nếu cần
  // return useMutation({...})
}
