import { useQuery } from '@tanstack/react-query';
import {
  getClassStudents,
  getClassStudentsCount,
  isStudentInClass,
  getClassDetails,
  getClassSummary,
  getClassDetailsStudents,
  getClassSubjectsList
} from '../services/class.services';
import type { GetClassStudentsParams, GetClassDetailsParams } from '../types';

/**
 * Hook to fetch all students in a specific class for a given academic year
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassStudents(
  params: GetClassStudentsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-students', classId, academicYearId],
    queryFn: () => getClassStudents(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to get the count of students in a class
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassStudentsCount(
  params: GetClassStudentsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-students-count', classId, academicYearId],
    queryFn: () => getClassStudentsCount(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to check if a student is enrolled in a specific class
 * @param studentId - The student ID to check
 * @param classId - The class ID
 * @param academicYearId - The academic year ID
 * @param termId - The term ID
 * @param options - React Query options
 */
export function useStudentInClass(
  studentId: string,
  classId: string,
  academicYearId: string,
  termId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: ['student-in-class', studentId, classId, academicYearId, termId],
    queryFn: () => isStudentInClass(studentId, classId, academicYearId, termId),
    enabled: !!(
      studentId &&
      classId &&
      academicYearId &&
      termId &&
      options?.enabled !== false
    ),
    staleTime: 10 * 60 * 1000, // 10 minutes (enrollment changes less frequently)
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook with automatic refetch capabilities for real-time student roster
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options with additional refetch settings
 */
export function useClassStudentsRealtime(
  params: GetClassStudentsParams,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-students-realtime', classId, academicYearId],
    queryFn: () => getClassStudents(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes for realtime
    refetchInterval: options?.refetchInterval || 5 * 60 * 1000, // Auto refetch every 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    ...options
  });
}

/**
 * Hook to fetch detailed information about a specific class
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassDetails(
  params: GetClassDetailsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-details', classId, academicYearId],
    queryFn: () => getClassDetails(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to get class summary (basic stats without full details)
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassSummary(
  params: GetClassDetailsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-summary', classId, academicYearId],
    queryFn: () => getClassSummary(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 10 * 60 * 1000, // 10 minutes (summary changes less frequently)
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to get only students list from class details
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassDetailsStudents(
  params: GetClassDetailsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-details-students', classId, academicYearId],
    queryFn: () => getClassDetailsStudents(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to get only subjects list for a class
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options
 */
export function useClassSubjects(
  params: GetClassDetailsParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-subjects', classId, academicYearId],
    queryFn: () => getClassSubjectsList(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 10 * 60 * 1000, // 10 minutes (subjects change less frequently)
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook with automatic refetch capabilities for real-time class details
 * @param params - Object containing classId and academicYearId
 * @param options - React Query options with additional refetch settings
 */
export function useClassDetailsRealtime(
  params: GetClassDetailsParams,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, academicYearId } = params;

  return useQuery({
    queryKey: ['class-details-realtime', classId, academicYearId],
    queryFn: () => getClassDetails(params),
    enabled: !!(classId && academicYearId && options?.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes for realtime
    refetchInterval: options?.refetchInterval || 5 * 60 * 1000, // Auto refetch every 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    ...options
  });
}

/**
 * Hook to get class details by class ID with default academic year
 * @param classId - The class ID
 * @param academicYearId - Optional academic year ID (defaults to current)
 * @param options - React Query options
 */
export function useClassDetailsByClassId(
  classId: string,
  academicYearId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  // Use default academic year if not provided
  const defaultAcademicYearId = '22222222-2222-2222-2222-222222222222';
  const yearId = academicYearId || defaultAcademicYearId;

  return useClassDetails(
    { classId, academicYearId: yearId },
    {
      enabled: !!classId,
      ...options
    }
  );
}
