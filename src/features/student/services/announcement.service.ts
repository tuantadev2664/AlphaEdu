import { apiCall } from '@/features/auth/services/auth.service';
import type {
  AnnouncementItem,
  AnnouncementItemResponse
} from '@/features/student/types';

export async function getClassAnnouncements(
  classId: string
): Promise<AnnouncementItemResponse> {
  if (!classId) throw new Error('classId is required');

  const endpoint = `/Announcement/class/${classId}`;
  const res = await apiCall(endpoint, { method: 'GET' });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as any).message || `Failed to fetch announcements: ${res.status}`
    );
  }

  const json = (await res.json().catch(() => [])) as AnnouncementItem[];

  if (!Array.isArray(json)) return [];

  return json;
}
