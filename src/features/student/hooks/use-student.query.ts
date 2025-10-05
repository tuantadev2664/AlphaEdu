import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/features/auth/services/auth.service';
import * as studentService from '@/features/student/services/student.service';
import { getClassAnnouncements } from '@/features/student/services/announcement.service';
import type { AnnouncementItemResponse } from '@/features/student/types';

// Query keys factory
export const studentKeys = {
  all: ['student'] as const,
  subjects: () => [...studentKeys.all, 'subjects'] as const,
  studentSubjects: (studentId: string) =>
    [...studentKeys.subjects(), studentId] as const,
  announcements: () => [...studentKeys.all, 'announcements'] as const,
  classAnnouncements: (classId: string) =>
    [...studentKeys.announcements(), classId] as const
};

// Query để lấy subjects và scores của student
export function useStudentSubjectsQuery(studentId?: string) {
  return useQuery({
    queryKey: studentKeys.studentSubjects(studentId || ''),
    queryFn: async () => {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const result = await studentService.getStudentSubjects(studentId);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: (failureCount, error) => {
      // Không retry nếu là lỗi 404 (student not found)
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Không cần refetch khi focus
    refetchOnMount: true
  });
}

// Query để lấy student subjects với transform data
export function useStudentSubjectsTransformed(studentId?: string) {
  const query = useStudentSubjectsQuery(studentId);

  const transformedData = query.data
    ? studentService.transformStudentSubjectsData(query.data)
    : undefined;

  return {
    ...query,
    data: transformedData
  };
}

// Hook để lấy current student ID từ auth
export function useCurrentStudentId() {
  const user = getUserData();
  return user?.role === 'student' ? user.id : undefined;
}

// Hook kết hợp để lấy subjects của current student
export function useCurrentStudentSubjects() {
  const studentId = useCurrentStudentId();
  return useStudentSubjectsTransformed(studentId);
}

// Query: announcements by current student's class
export function useCurrentClassAnnouncements(classId?: string) {
  return useQuery({
    queryKey: studentKeys.classAnnouncements(classId || ''),
    enabled: !!classId,
    queryFn: async () => {
      if (!classId) throw new Error('Class ID is required');
      const items = await getClassAnnouncements(classId);
      return items as AnnouncementItemResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
