import { useQuery } from '@tanstack/react-query';
import {
  getTeacherClasses,
  getStudentDetail
} from '../services/teacher.service';
import type { GetTeacherClassesParams } from '../types';

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
