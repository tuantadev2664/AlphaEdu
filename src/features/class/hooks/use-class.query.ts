import { useQuery } from '@tanstack/react-query';
import {
  getClassStudents,
  getClassStudentsCount,
  isStudentInClass
} from '../services/class.services';
import type { GetClassStudentsParams } from '../types';

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
 * @param options - React Query options
 */
export function useStudentInClass(
  studentId: string,
  classId: string,
  academicYearId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: ['student-in-class', studentId, classId, academicYearId],
    queryFn: () => isStudentInClass(studentId, classId, academicYearId),
    enabled: !!(
      studentId &&
      classId &&
      academicYearId &&
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
