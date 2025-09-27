import type { BehaviorNote } from '@/features/teacher/types';

// Group behavior notes by student
export interface GroupedBehaviorNote {
  student_id: string;
  student_name: string;
  student?: any;
  notes: BehaviorNote[];
  latest_note: BehaviorNote;
  note_count: number;
  excellent_count: number;
  good_count: number;
  fair_count: number;
  needs_improvement_count: number;
  poor_count: number;
}

// Helper function to group notes by student (server-side safe)
export const groupNotesByStudent = (
  notes: BehaviorNote[]
): GroupedBehaviorNote[] => {
  const grouped = notes.reduce(
    (acc, note) => {
      const studentId = note.student_id;
      if (!acc[studentId]) {
        acc[studentId] = {
          student_id: studentId,
          student_name: note.student?.full_name || 'Unknown Student',
          student: note.student,
          notes: [],
          latest_note: note,
          note_count: 0,
          excellent_count: 0,
          good_count: 0,
          fair_count: 0,
          needs_improvement_count: 0,
          poor_count: 0
        };
      }

      acc[studentId].notes.push(note);
      acc[studentId].note_count++;

      // Count by behavior level
      switch (note.level) {
        case 'excellent':
          acc[studentId].excellent_count++;
          break;
        case 'good':
          acc[studentId].good_count++;
          break;
        case 'fair':
          acc[studentId].fair_count++;
          break;
        case 'needs_improvement':
          acc[studentId].needs_improvement_count++;
          break;
        case 'poor':
          acc[studentId].poor_count++;
          break;
      }

      // Update latest note if this one is more recent
      if (
        new Date(note.created_at) >
        new Date(acc[studentId].latest_note.created_at)
      ) {
        acc[studentId].latest_note = note;
      }

      return acc;
    },
    {} as Record<string, GroupedBehaviorNote>
  );

  return Object.values(grouped).sort(
    (a, b) =>
      new Date(b.latest_note.created_at).getTime() -
      new Date(a.latest_note.created_at).getTime()
  );
};
