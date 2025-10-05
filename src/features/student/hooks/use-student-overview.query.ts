import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/features/auth/services/auth.service';
import { getStudentOverview } from '@/features/student/services/student-overview.service';

export const studentOverviewKeys = {
  all: ['student-overview'] as const,
  byStudent: (studentId: string) =>
    [...studentOverviewKeys.all, studentId] as const
};

export function useCurrentStudentOverview() {
  const currentUser = getUserData();
  const studentId = currentUser?.id;

  return useQuery({
    queryKey: studentOverviewKeys.byStudent(studentId || 'unknown'),
    enabled: !!studentId,
    queryFn: () => getStudentOverview(studentId!)
  });
}
