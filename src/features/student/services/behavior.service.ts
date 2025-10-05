import { apiCall } from '@/features/auth/services/auth.service';
import type {
  BehaviorNote,
  BehaviorLevel,
  BehaviorNoteData,
  BehaviorSummary,
  BehaviorNoteResponse
} from '@/features/student/types';

// Types moved to features/student/types

export async function getStudentBehaviorNotes(
  studentId: string
): Promise<BehaviorNoteResponse> {
  if (!studentId) throw new Error('studentId is required');

  const endpoint = `/BehaviorNote/student/${studentId}`;
  const res = await apiCall(endpoint, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || `Failed to fetch behavior notes: ${res.status}`
    );
  }

  const json: unknown = await res.json().catch(() => []);

  if (Array.isArray(json)) {
    return json as BehaviorNoteData[];
  }

  if (json && typeof json === 'object' && Array.isArray((json as any).data)) {
    return (json as any).data as BehaviorNoteData[];
  }
  return [];
}

export function transformBehaviorNotes(
  apiNotes: BehaviorNoteResponse
): BehaviorNote[] {
  return (apiNotes || []).map((n) => {
    const level = (n.level || 'Fair') as BehaviorLevel;
    return {
      id: n.id,
      student_id: '',
      class_id: '',
      term_id: n.term?.termId || '',
      note: n.note,
      level,
      created_by: n.teacher?.createdBy || '',
      created_at: n.createdAt,
      created_by_user: n.teacher
        ? {
            id: n.teacher.createdBy,
            role: 'teacher',
            full_name: n.teacher.teacherName,
            email: '',
            phone: '',
            school_id: '',
            created_at: n.createdAt
          }
        : undefined
    };
  });
}

export function computeBehaviorSummary(notes: BehaviorNote[]): BehaviorSummary {
  const summary: BehaviorSummary = {
    excellent_count: 0,
    good_count: 0,
    fair_count: 0,
    needs_improvement_count: 0,
    poor_count: 0
  };

  for (const n of notes || []) {
    switch (n.level) {
      case 'Excellent':
        summary.excellent_count += 1;
        break;
      case 'Good':
        summary.good_count += 1;
        break;
      case 'Fair':
        summary.fair_count += 1;
        break;
      case 'Needs improvement':
        summary.needs_improvement_count += 1;
        break;
      case 'Poor':
        summary.poor_count += 1;
        break;
      default:
        summary.fair_count += 1;
        break;
    }
  }

  return summary;
}

export function getLatestBehaviorNote(
  notes: BehaviorNote[]
): BehaviorNote | null {
  if (!notes || notes.length === 0) return null;
  return notes
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
}
