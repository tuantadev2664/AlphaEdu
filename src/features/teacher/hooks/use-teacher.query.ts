import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeacherClasses,
  getStudentDetail,
  getActiveAnnouncements,
  getClassAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../services/teacher.service';
import type {
  GetTeacherClassesParams,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest
} from '../types';

/**
 * Hook to fetch all classes assigned to the current teacher
 * @param params - Query parameters including academicYearId
 * @param options - React Query options
 */
export function useTeacherClasses(
  params: GetTeacherClassesParams = {},
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: ['teacher-classes', params],
    queryFn: () => getTeacherClasses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch teacher classes for a specific academic year
 * @param academicYearId - The academic year ID
 * @param options - React Query options
 */
export function useTeacherClassesByYear(
  academicYearId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useTeacherClasses(
    { academicYearId },
    {
      enabled: !!academicYearId,
      ...options
    }
  );
}

/**
 * Hook to fetch detailed information about a specific student
 * @param studentId - The student ID
 * @param options - React Query options
 */
export function useStudentDetail(
  studentId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: ['student-detail', studentId],
    queryFn: () => getStudentDetail(studentId),
    enabled: !!studentId && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch active announcements for teachers
 * @param options - React Query options
 */
export function useActiveAnnouncements(options?: {
  enabled?: boolean;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
}) {
  return useQuery({
    queryKey: ['active-announcements'],
    queryFn: () => getActiveAnnouncements(),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch announcements for a specific class
 * @param classId - The class ID
 * @param options - React Query options
 */
export function useCurrentClassAnnouncements(
  classId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: ['class-announcements', classId],
    queryFn: () => getClassAnnouncements(classId!),
    enabled: !!classId && options?.enabled !== false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

// Query keys factory for announcements
export const announcementKeys = {
  all: ['announcements'] as const,
  active: () => [...announcementKeys.all, 'active'] as const,
  byClass: (classId: string) =>
    [...announcementKeys.all, 'class', classId] as const
};

/**
 * Hook to create a new announcement with optimistic update
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    // Optimistic update: Add the announcement to cache immediately
    onMutate: async (newAnnouncement) => {
      const queryKey = ['class-announcements', newAnnouncement.classId];

      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousAnnouncements = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        const optimisticAnnouncement = {
          id: `temp-${Date.now()}`, // Temporary ID
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          classId: newAnnouncement.classId,
          expiresAt: newAnnouncement.expiresAt,
          isUrgent: newAnnouncement.isUrgent || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return old
          ? [...old, optimisticAnnouncement]
          : [optimisticAnnouncement];
      });

      // Return context with previous data for rollback
      return { previousAnnouncements, queryKey };
    },
    // If mutation fails, rollback to previous value
    onError: (error, newAnnouncement, context) => {
      console.error('Failed to create announcement:', error);
      if (context?.previousAnnouncements) {
        queryClient.setQueryData(
          context.queryKey,
          context.previousAnnouncements
        );
      }
    },
    // After success or error, refetch to sync with server
    onSettled: (data, error, variables) => {
      // Invalidate and refetch announcements for the class
      queryClient.invalidateQueries({
        queryKey: ['class-announcements', variables.classId]
      });
      // Also invalidate active announcements
      queryClient.invalidateQueries({
        queryKey: announcementKeys.active()
      });
    }
  });
}

/**
 * Hook to update an announcement with optimistic update
 */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAnnouncement,
    // Optimistic update: Update the announcement in cache immediately
    onMutate: async (updatedAnnouncement) => {
      const queryKey = ['class-announcements', updatedAnnouncement.classId];

      // Cancel any outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousAnnouncements = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return old.map((announcement: any) =>
          announcement.id === updatedAnnouncement.id
            ? {
                ...announcement,
                title: updatedAnnouncement.title,
                content: updatedAnnouncement.content,
                expiresAt: updatedAnnouncement.expiresAt,
                isUrgent: updatedAnnouncement.isUrgent,
                updatedAt: new Date().toISOString()
              }
            : announcement
        );
      });

      // Return context with previous data for rollback
      return { previousAnnouncements, queryKey };
    },
    // If mutation fails, rollback to previous value
    onError: (error, updatedAnnouncement, context) => {
      console.error('Failed to update announcement:', error);
      if (context?.previousAnnouncements) {
        queryClient.setQueryData(
          context.queryKey,
          context.previousAnnouncements
        );
      }
    },
    // After success or error, refetch to sync with server
    onSettled: (data, error, variables) => {
      // Invalidate and refetch announcements for the class
      queryClient.invalidateQueries({
        queryKey: ['class-announcements', variables.classId]
      });
      // Also invalidate active announcements
      queryClient.invalidateQueries({
        queryKey: announcementKeys.active()
      });
    }
  });
}

/**
 * Hook to delete an announcement with optimistic update
 */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    // Optimistic update: Remove the announcement from cache immediately
    onMutate: async (announcementId) => {
      // Get all announcement queries to update
      const queryCache = queryClient.getQueryCache();
      const allQueries = queryCache.findAll({
        queryKey: ['class-announcements']
      });

      // Store previous data for all affected queries
      const previousData: Array<{ queryKey: any; data: any }> = [];

      // Cancel outgoing refetches and optimistically remove the announcement
      for (const query of allQueries) {
        await queryClient.cancelQueries({ queryKey: query.queryKey });

        const previousAnnouncements = queryClient.getQueryData(query.queryKey);
        previousData.push({
          queryKey: query.queryKey,
          data: previousAnnouncements
        });

        // Remove the announcement from cache
        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old) return old;
          return old.filter(
            (announcement: any) => announcement.id !== announcementId
          );
        });
      }

      // Return context with previous data for rollback
      return { previousData };
    },
    // If mutation fails, rollback to previous values
    onError: (error, announcementId, context) => {
      console.error('Failed to delete announcement:', error);

      // Restore all previous data
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    // After success or error, refetch to sync with server
    onSettled: () => {
      // Invalidate all announcement queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all
      });
    }
  });
}
