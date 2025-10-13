import { apiCall } from '@/features/auth/services/auth.service';
import type {
  GetTeacherClassesParams,
  GetTeacherClassesResponse,
  StudentDetailResponse,
  TeacherAnnouncementResponse,
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
  UpdateAnnouncementRequest,
  UpdateAnnouncementResponse,
  DeleteAnnouncementResponse
} from '../types';

// API Base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.alphaedu.id.vn/api';

/**
 * Get all classes that a teacher is assigned to
 */
export async function getTeacherClasses(
  params: GetTeacherClassesParams = {}
): Promise<GetTeacherClassesResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.academicYearId) {
      queryParams.append('academicYearId', params.academicYearId);
    }

    const endpoint = `/TeacherAssignments/my-classes${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    console.log('🔄 Fetching teacher classes:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch teacher classes: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(
      '✅ Teacher classes fetched successfully:',
      data.length,
      'classes'
    );

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching teacher classes:', error);
    throw new Error(error.message || 'Failed to fetch teacher classes');
  }
}

/**
 * Get detailed information about a specific student
 * @param studentId - The student ID
 */
export async function getStudentDetail(
  studentId: string
): Promise<StudentDetailResponse> {
  try {
    const endpoint = `/Student/${studentId}`;

    console.log('🔄 Fetching student detail:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch student detail: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('✅ Student detail fetched successfully:', data.fullName);

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching student detail:', error);
    throw new Error(error.message || 'Failed to fetch student detail');
  }
}

/**
 * Get active announcements for teachers
 */
export async function getActiveAnnouncements(): Promise<TeacherAnnouncementResponse> {
  try {
    const endpoint = `/Announcement/active`;

    console.log('🔄 Fetching active announcements:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch active announcements: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('✅ Active announcements fetched successfully:', data.length);

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching active announcements:', error);
    throw new Error(error.message || 'Failed to fetch active announcements');
  }
}

/**
 * Get announcements for a specific class
 * @param classId - The class ID
 */
export async function getClassAnnouncements(
  classId: string
): Promise<TeacherAnnouncementResponse> {
  try {
    const endpoint = `/Announcement/class/${classId}`;

    console.log('🔄 Fetching class announcements:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch class announcements: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('✅ Class announcements fetched successfully:', data.length);

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching class announcements:', error);
    throw new Error(error.message || 'Failed to fetch class announcements');
  }
}

/**
 * Create a new announcement
 * @param data - Announcement data
 */
export async function createAnnouncement(
  data: CreateAnnouncementRequest
): Promise<CreateAnnouncementResponse> {
  try {
    const endpoint = `/Announcement`;

    console.log('🔄 Creating announcement:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create announcement: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('✅ Announcement created successfully:', result.id);

    return result;
  } catch (error: any) {
    console.error('❌ Error creating announcement:', error);
    throw new Error(error.message || 'Failed to create announcement');
  }
}

/**
 * Update an existing announcement
 * @param data - Announcement update data
 */
export async function updateAnnouncement(
  data: UpdateAnnouncementRequest
): Promise<UpdateAnnouncementResponse> {
  try {
    const endpoint = `/Announcement/${data.id}`;

    console.log('🔄 Updating announcement:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id,
        title: data.title,
        content: data.content,
        classId: data.classId,
        subjectId: data.subjectId,
        expiresAt: data.expiresAt,
        isUrgent: data.isUrgent
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update announcement: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('✅ Announcement updated successfully:', result.id);

    return result;
  } catch (error: any) {
    console.error('❌ Error updating announcement:', error);
    throw new Error(error.message || 'Failed to update announcement');
  }
}

/**
 * Delete an announcement
 * @param announcementId - The announcement ID
 */
export async function deleteAnnouncement(
  announcementId: string
): Promise<DeleteAnnouncementResponse> {
  try {
    const endpoint = `/Announcement/${announcementId}`;

    console.log('🔄 Deleting announcement:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete announcement: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('✅ Announcement deleted successfully:', announcementId);

    return result;
  } catch (error: any) {
    console.error('❌ Error deleting announcement:', error);
    throw new Error(error.message || 'Failed to delete announcement');
  }
}
