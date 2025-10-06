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
 * Hook to create a new announcement
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: (data) => {
      // Invalidate and refetch announcements for the class
      queryClient.invalidateQueries({
        queryKey: announcementKeys.byClass(data.classId!)
      });
      // Also invalidate active announcements
      queryClient.invalidateQueries({
        queryKey: announcementKeys.active()
      });
    },
    onError: (error) => {
      console.error('Failed to create announcement:', error);
    }
  });
}

/**
 * Hook to update an announcement
 */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAnnouncement,
    onSuccess: (data) => {
      // Invalidate and refetch announcements for the class
      queryClient.invalidateQueries({
        queryKey: announcementKeys.byClass(data.classId!)
      });
      // Also invalidate active announcements
      queryClient.invalidateQueries({
        queryKey: announcementKeys.active()
      });
    },
    onError: (error) => {
      console.error('Failed to update announcement:', error);
    }
  });
}

/**
 * Hook to delete an announcement
 */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (data, announcementId) => {
      // Invalidate all announcement queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: announcementKeys.all
      });
    },
    onError: (error) => {
      console.error('Failed to delete announcement:', error);
    }
  });
}
