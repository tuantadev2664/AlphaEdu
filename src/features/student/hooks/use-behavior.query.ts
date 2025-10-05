import { useQuery } from '@tanstack/react-query';
import { getUserData } from '@/features/auth/services/auth.service';
import {
  getStudentBehaviorNotes,
  transformBehaviorNotes,
  computeBehaviorSummary,
  getLatestBehaviorNote
} from '@/features/student/services/behavior.service';

export const behaviorKeys = {
  all: ['behavior'] as const,
  byStudent: (studentId: string) => [...behaviorKeys.all, studentId] as const
};

export function useCurrentStudentBehaviorNotes() {
  const currentUser = getUserData();
  const studentId = currentUser?.id;

  return useQuery({
    queryKey: behaviorKeys.byStudent(studentId || 'unknown'),
    enabled: !!studentId,
    queryFn: async () => {
      const response = await getStudentBehaviorNotes(studentId!);
      const notes = transformBehaviorNotes(response || []);
      const summary = computeBehaviorSummary(notes);
      const latest = getLatestBehaviorNote(notes);
      return { notes, summary, latest };
    }
  });
}
