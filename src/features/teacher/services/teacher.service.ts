import { apiCall } from '@/features/auth/services/auth.service';
import type {
  GetTeacherClassesParams,
  GetTeacherClassesResponse
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
