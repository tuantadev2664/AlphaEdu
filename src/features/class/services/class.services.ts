import { apiCall } from '@/features/auth/services/auth.service';
import type {
  GetClassStudentsParams,
  GetClassStudentsResponse
} from '../types';

/**
 * Get all students in a specific class for a given academic year
 * @param params - Object containing classId and academicYearId
 */
export async function getClassStudents(
  params: GetClassStudentsParams
): Promise<GetClassStudentsResponse> {
  try {
    const { classId, academicYearId } = params;

    if (!classId || !academicYearId) {
      throw new Error('Both classId and academicYearId are required');
    }

    const endpoint = `/Student/class/${classId}/year/${academicYearId}`;

    console.log('🔄 Fetching class students:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to fetch class students: ${response.status}`
      );
    }

    const data = await response.json();
    console.log(
      '✅ Class students fetched successfully:',
      data.length,
      'students'
    );

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching class students:', error);
    throw new Error(error.message || 'Failed to fetch class students');
  }
}

/**
 * Get students count for a class
 * @param params - Object containing classId and academicYearId
 */
export async function getClassStudentsCount(
  params: GetClassStudentsParams
): Promise<number> {
  try {
    const students = await getClassStudents(params);
    return students.length;
  } catch (error: any) {
    console.error('❌ Error getting class students count:', error);
    return 0;
  }
}

/**
 * Check if a student is enrolled in a specific class
 * @param studentId - The student ID to check
 * @param classId - The class ID
 * @param academicYearId - The academic year ID
 */
export async function isStudentInClass(
  studentId: string,
  classId: string,
  academicYearId: string
): Promise<boolean> {
  try {
    const students = await getClassStudents({ classId, academicYearId });
    return students.some((student) => student.id === studentId);
  } catch (error: any) {
    console.error('❌ Error checking student enrollment:', error);
    return false;
  }
}
