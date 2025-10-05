import { apiCall } from '@/features/auth/services/auth.service';
import type { StudentOverviewResponse } from '@/features/student/types';

export async function getStudentOverview(
  studentId: string
): Promise<StudentOverviewResponse> {
  if (!studentId) throw new Error('studentId is required');

  const endpoint = `/Student/${studentId}`;
  const res = await apiCall(endpoint, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || `Failed to fetch student overview: ${res.status}`
    );
  }

  return res.json();
}
