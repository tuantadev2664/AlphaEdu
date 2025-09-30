import { apiCall } from '@/features/auth/services/auth.service';
import type {
  GetScoresParams,
  GetScoresResponse,
  ScoreStats,
  StudentScoreStats,
  StudentScore,
  UpdateScoreRequest,
  UpdateScoreResponse,
  CreateAssessmentRequest,
  CreateAssessmentResponse
} from '../type';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.alphaedu.id.vn/api';

/**
 * Get scores for a specific class, subject, and term
 * @param params - Object containing classId, subjectId, and termId
 * @returns Promise<GetScoresResponse>
 */
export async function getScores(
  params: GetScoresParams
): Promise<GetScoresResponse> {
  try {
    const { classId, subjectId, termId } = params;

    if (!classId || !subjectId || !termId) {
      throw new Error('classId, subjectId, and termId are required');
    }

    const endpoint = `/Score/class/${classId}/subject/${subjectId}/term/${termId}/scores`;

    const response = await apiCall(endpoint, { method: 'GET' });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch scores: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch scores');
  }
}

/**
 * Calculate score statistics for a class/subject/term
 * @param params - Object containing classId, subjectId, and termId
 * @returns Promise<ScoreStats>
 */
export async function getScoreStats(
  params: GetScoresParams
): Promise<ScoreStats> {
  try {
    const scoresData = await getScores(params);

    if (scoresData.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        totalStudents: 0,
        passedStudents: 0,
        passRate: 0
      };
    }

    // Calculate individual student averages
    const studentAverages = scoresData.map((student) => {
      if (student.scores.length === 0) return 0;

      const totalWeightedScore = student.scores.reduce((sum, score) => {
        return sum + score.score * score.weight;
      }, 0);

      const totalWeight = student.scores.reduce((sum, score) => {
        return sum + score.weight;
      }, 0);

      return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    });

    const validAverages = studentAverages.filter((avg) => avg > 0);
    const average =
      validAverages.length > 0
        ? validAverages.reduce((sum, avg) => sum + avg, 0) /
          validAverages.length
        : 0;

    const highest = validAverages.length > 0 ? Math.max(...validAverages) : 0;
    const lowest = validAverages.length > 0 ? Math.min(...validAverages) : 0;
    const passedStudents = validAverages.filter((avg) => avg >= 5.0).length; // Assuming 5.0 is passing grade
    const passRate =
      scoresData.length > 0 ? (passedStudents / scoresData.length) * 100 : 0;

    return {
      average: Math.round(average * 100) / 100,
      highest: Math.round(highest * 100) / 100,
      lowest: Math.round(lowest * 100) / 100,
      totalStudents: scoresData.length,
      passedStudents,
      passRate: Math.round(passRate * 100) / 100
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to calculate score statistics');
  }
}

/**
 * Get individual student score statistics
 * @param params - Object containing classId, subjectId, and termId
 * @returns Promise<StudentScoreStats[]>
 */
export async function getStudentScoreStats(
  params: GetScoresParams
): Promise<StudentScoreStats[]> {
  try {
    const scoresData = await getScores(params);

    return scoresData.map((student) => {
      const completedScores = student.scores.filter((score) => !score.isAbsent);
      const totalAssessments = student.scores.length;
      const completedAssessments = completedScores.length;

      let totalScore = 0;
      let averageScore = 0;

      if (completedScores.length > 0) {
        const totalWeightedScore = completedScores.reduce((sum, score) => {
          return sum + score.score * score.weight;
        }, 0);

        const totalWeight = completedScores.reduce((sum, score) => {
          return sum + score.weight;
        }, 0);

        totalScore = totalWeightedScore;
        averageScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
      }

      const completionRate =
        totalAssessments > 0
          ? (completedAssessments / totalAssessments) * 100
          : 0;

      return {
        studentId: student.studentId,
        fullName: student.fullName,
        totalScore: Math.round(totalScore * 100) / 100,
        averageScore: Math.round(averageScore * 100) / 100,
        completedAssessments,
        totalAssessments,
        completionRate: Math.round(completionRate * 100) / 100
      };
    });
  } catch (error: any) {
    throw new Error(
      error.message || 'Failed to calculate student score statistics'
    );
  }
}

/**
 * Check if a student has completed all assessments
 * @param studentId - The student ID
 * @param params - Object containing classId, subjectId, and termId
 * @returns Promise<boolean>
 */
export async function hasStudentCompletedAllAssessments(
  studentId: string,
  params: GetScoresParams
): Promise<boolean> {
  try {
    const scoresData = await getScores(params);
    const student = scoresData.find((s) => s.studentId === studentId);

    if (!student) {
      return false;
    }

    return student.scores.every((score) => !score.isAbsent);
  } catch (error: any) {
    throw new Error(
      error.message || 'Failed to check student completion status'
    );
  }
}

/**
 * Get scores for a specific student in a class/subject/term
 * @param studentId - The student ID
 * @param params - Object containing classId, subjectId, and termId
 * @returns Promise<StudentScore | null>
 */
export async function getStudentScores(
  studentId: string,
  params: GetScoresParams
): Promise<StudentScore | null> {
  try {
    const scoresData = await getScores(params);
    return (
      scoresData.find((student) => student.studentId === studentId) || null
    );
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch student scores');
  }
}

// Thêm vào cuối file trước export cuối cùng
/**
 * Update a specific score
 * @param scoreId - The score ID to update
 * @param data - Update score request data
 * @returns Promise<UpdateScoreResponse>
 */
export async function updateScore(
  scoreId: string,
  data: Omit<UpdateScoreRequest, 'id'>
): Promise<UpdateScoreResponse> {
  try {
    if (!scoreId) {
      throw new Error('scoreId is required');
    }

    const endpoint = `/Score/${scoreId}`;

    const requestBody: UpdateScoreRequest = {
      id: scoreId,
      score1: data.score1,
      isAbsent: data.isAbsent,
      comment: data.comment || ''
    };

    const response = await apiCall(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update score: ${response.status}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Score updated successfully',
      data: result
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update score'
    };
  }
}

/**
 * Create a complete assessment with grade component and initialize scores
 */
export async function createAssessment(
  data: CreateAssessmentRequest
): Promise<CreateAssessmentResponse> {
  try {
    const endpoint = `/Assessments`;

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
        errorData.message || `Failed to create assessment: ${response.status}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: 'Assessment created successfully',
      data: result
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create assessment'
    };
  }
}
