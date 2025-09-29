import { apiCall } from '@/features/auth/services/auth.service';
import type {
  GetClassStudentsParams,
  GetClassStudentsResponse,
  GetClassDetailsParams,
  GetClassDetailsResponse
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

/**
 * Get detailed information about a specific class including students and subjects
 * @param params - Object containing classId and academicYearId
 */
export async function getClassDetails(
  params: GetClassDetailsParams
): Promise<GetClassDetailsResponse> {
  try {
    const { classId, academicYearId } = params;

    if (!classId || !academicYearId) {
      throw new Error('Both classId and academicYearId are required');
    }

    const endpoint = `/Class/${classId}/year/${academicYearId}/details`;

    console.log('🔄 Fetching class details:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch class details: ${response.status}`
      );
    }

    const data = await response.json();
    console.log('✅ Class details fetched successfully:', data.className);

    return data;
  } catch (error: any) {
    console.error('❌ Error fetching class details:', error);
    throw new Error(error.message || 'Failed to fetch class details');
  }
}

/**
 * Get class summary info (basic stats without full details)
 * @param params - Object containing classId and academicYearId
 */
export async function getClassSummary(params: GetClassDetailsParams): Promise<{
  classId: string;
  className: string;
  studentCount: number;
  subjectCount: number;
  homeroomTeacherName: string;
}> {
  try {
    const classDetails = await getClassDetails(params);

    return {
      classId: classDetails.classId,
      className: classDetails.className,
      studentCount: classDetails.studentCount,
      subjectCount: classDetails.subjects.length,
      homeroomTeacherName: classDetails.homeroomTeacherName
    };
  } catch (error: any) {
    console.error('❌ Error fetching class summary:', error);
    throw new Error(error.message || 'Failed to fetch class summary');
  }
}

/**
 * Get only students list from class details
 * @param params - Object containing classId and academicYearId
 */
export async function getClassDetailsStudents(
  params: GetClassDetailsParams
): Promise<Array<{ studentId: string; fullName: string }>> {
  try {
    const classDetails = await getClassDetails(params);
    return classDetails.students;
  } catch (error: any) {
    console.error('❌ Error fetching class details students:', error);
    return [];
  }
}

/**
 * Get only subjects list from class details
 * @param params - Object containing classId and academicYearId
 */
export async function getClassSubjectsList(
  params: GetClassDetailsParams
): Promise<
  Array<{
    subjectId: string;
    subjectName: string;
    teacherId: string;
    teacherName: string;
  }>
> {
  try {
    const classDetails = await getClassDetails(params);
    return classDetails.subjects;
  } catch (error: any) {
    console.error('❌ Error fetching class subjects list:', error);
    return [];
  }
}
