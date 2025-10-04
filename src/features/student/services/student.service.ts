import { apiCall } from '@/features/auth/services/auth.service';
import type { StudentSubjectsResponse } from '@/features/student/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://54.79.247.75/api';

export interface StudentServiceError {
  message: string;
  status?: number;
}

// Get student subjects and scores
export async function getStudentSubjects(studentId: string): Promise<{
  data?: StudentSubjectsResponse;
  error?: StudentServiceError;
}> {
  try {
    const response = await apiCall(`/Subject/student/${studentId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: {
          message:
            errorData.message ||
            `Failed to fetch student subjects: ${response.status}`,
          status: response.status
        }
      };
    }

    const data: StudentSubjectsResponse = await response.json();
    return { data };
  } catch (error: any) {
    console.error('❌ Error fetching student subjects:', error);
    return {
      error: {
        message: error.message || 'Network error occurred',
        status: error.status
      }
    };
  }
}

// Transform API data to match existing component structure
export function transformStudentSubjectsData(apiData: StudentSubjectsResponse) {
  return apiData.map((subject) => ({
    subject: {
      id: subject.subjectId,
      name: subject.subjectName,
      code: '', // Not provided by API
      level: 'lower_secondary' as const, // Default or derive from context
      is_active: true
    },
    scores: subject.components.flatMap((component) =>
      component.assessments.map((assessment) => ({
        id: assessment.assessmentId,
        assessment_id: assessment.assessmentId,
        student_id: '', // Will be filled from context
        score: assessment.score,
        is_absent: assessment.isAbsent,
        comment: assessment.comment || '',
        created_by: '',
        created_at: assessment.dueDate,
        updated_at: assessment.dueDate,
        assessment: {
          id: assessment.assessmentId,
          grade_component_id: component.gradeComponentId,
          title: assessment.title,
          due_date: assessment.dueDate,
          description: '',
          grade_component: {
            id: component.gradeComponentId,
            class_id: '',
            subject_id: subject.subjectId,
            term_id: '',
            name: component.componentName,
            kind: component.kind,
            weight: component.weight,
            max_score: component.maxScore,
            position: 0,
            subject: {
              id: subject.subjectId,
              name: subject.subjectName,
              code: '',
              level: 'lower_secondary' as const,
              is_active: true
            }
          }
        }
      }))
    ),
    gradeComponents: subject.components.map((component) => ({
      id: component.gradeComponentId,
      class_id: '',
      subject_id: subject.subjectId,
      term_id: '',
      name: component.componentName,
      kind: component.kind,
      weight: component.weight,
      max_score: component.maxScore,
      position: 0,
      subject: {
        id: subject.subjectId,
        name: subject.subjectName,
        code: '',
        level: 'lower_secondary' as const,
        is_active: true
      }
    }))
  }));
}
