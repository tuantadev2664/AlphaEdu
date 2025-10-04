import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/features/auth/services/auth.service';
import * as parentService from '@/features/parent/services/parent.service';

// Query keys factory
export const parentKeys = {
  all: ['parent'] as const,
  childrenFullInfo: () => [...parentKeys.all, 'children-full-info'] as const,
  childrenFullInfoByTerm: (termId: string) =>
    [...parentKeys.childrenFullInfo(), termId] as const
};

// Helper to get current parent id from auth (if needed later)
export function useCurrentParentId() {
  const user = getUserData();
  return user?.role === 'parent' ? user.id : undefined;
}

// Query to fetch parent children full info by term
export function useParentChildrenFullInfoQuery(termId?: string) {
  return useQuery({
    queryKey: parentKeys.childrenFullInfoByTerm(termId || ''),
    queryFn: async () => {
      if (!termId) {
        throw new Error('termId is required');
      }

      const result = await parentService.getParentChildrenFullInfo(termId);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled: !!termId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        (error.message.includes('401') || error.message.includes('403'))
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
}
