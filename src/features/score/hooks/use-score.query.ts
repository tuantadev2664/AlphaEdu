import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getScores,
  getScoreStats,
  getStudentScoreStats,
  hasStudentCompletedAllAssessments,
  getStudentScores,
  updateScore,
  createAssessment
} from '../services/score.services';
import type {
  CreateAssessmentRequest,
  GetScoresParams,
  UpdateScoreRequest
} from '../type';

/**
 * Hook to fetch scores for a specific class, subject, and term
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useScores(
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['scores', classId, subjectId, termId],
    queryFn: () => getScores(params),
    enabled: !!(classId && subjectId && termId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch score statistics for a class/subject/term
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useScoreStats(
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['score-stats', classId, subjectId, termId],
    queryFn: () => getScoreStats(params),
    enabled: !!(classId && subjectId && termId && options?.enabled !== false),
    staleTime: 10 * 60 * 1000, // 10 minutes (stats change less frequently)
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch individual student score statistics
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useStudentScoreStats(
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['student-score-stats', classId, subjectId, termId],
    queryFn: () => getStudentScoreStats(params),
    enabled: !!(classId && subjectId && termId && options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to check if a student has completed all assessments
 * @param studentId - The student ID
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useStudentCompletionStatus(
  studentId: string,
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['student-completion', studentId, classId, subjectId, termId],
    queryFn: () => hasStudentCompletedAllAssessments(studentId, params),
    enabled: !!(
      studentId &&
      classId &&
      subjectId &&
      termId &&
      options?.enabled !== false
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to fetch scores for a specific student
 * @param studentId - The student ID
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useStudentScores(
  studentId: string,
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['student-scores', studentId, classId, subjectId, termId],
    queryFn: () => getStudentScores(studentId, params),
    enabled: !!(
      studentId &&
      classId &&
      subjectId &&
      termId &&
      options?.enabled !== false
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook with automatic refetch capabilities for real-time score updates
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options with additional refetch settings
 */
export function useScoresRealtime(
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const { classId, subjectId, termId } = params;

  return useQuery({
    queryKey: ['scores-realtime', classId, subjectId, termId],
    queryFn: () => getScores(params),
    enabled: !!(classId && subjectId && termId && options?.enabled !== false),
    staleTime: 2 * 60 * 1000, // 2 minutes for realtime
    refetchInterval: options?.refetchInterval || 5 * 60 * 1000, // Auto refetch every 5 minutes
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    ...options
  });
}

/**
 * Hook to get scores by class and subject with default term
 * @param classId - The class ID
 * @param subjectId - The subject ID
 * @param termId - Optional term ID (defaults to current term)
 * @param options - React Query options
 */
export function useScoresByClassAndSubject(
  classId: string,
  subjectId: string,
  termId?: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  // Use default term if not provided (you might want to get this from a context or config)
  const defaultTermId = '11111111-1111-1111-1111-111111111111';
  const currentTermId = termId || defaultTermId;

  return useScores(
    { classId, subjectId, termId: currentTermId },
    {
      enabled: !!(classId && subjectId),
      ...options
    }
  );
}

/**
 * Hook to get gradebook data with comprehensive information
 * Combines scores, stats, and student statistics
 * @param params - Object containing classId, subjectId, and termId
 * @param options - React Query options
 */
export function useGradebook(
  params: GetScoresParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  const scoresQuery = useScores(params, options);
  const statsQuery = useScoreStats(params, options);
  const studentStatsQuery = useStudentScoreStats(params, options);

  return {
    scores: scoresQuery,
    stats: statsQuery,
    studentStats: studentStatsQuery,
    isLoading:
      scoresQuery.isLoading ||
      statsQuery.isLoading ||
      studentStatsQuery.isLoading,
    isError:
      scoresQuery.isError || statsQuery.isError || studentStatsQuery.isError,
    error: scoresQuery.error || statsQuery.error || studentStatsQuery.error,
    refetch: () => {
      scoresQuery.refetch();
      statsQuery.refetch();
      studentStatsQuery.refetch();
    }
  };
}

/**
 * Hook to update a specific score
 * @returns Mutation object for updating score
 */
export function useUpdateScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      scoreId,
      data
    }: {
      scoreId: string;
      data: Omit<UpdateScoreRequest, 'id'>;
    }) => updateScore(scoreId, data),

    onSuccess: (result, { scoreId }) => {
      if (result.success) {
        // Invalidate related queries to refetch data
        queryClient.invalidateQueries({
          queryKey: ['scores']
        });
        queryClient.invalidateQueries({
          queryKey: ['score-stats']
        });
        queryClient.invalidateQueries({
          queryKey: ['student-score-stats']
        });
        queryClient.invalidateQueries({
          queryKey: ['student-scores']
        });
        queryClient.invalidateQueries({
          queryKey: ['scores-realtime']
        });
      }
    },

    onError: (error) => {
      console.error('Failed to update score:', error);
    }
  });
}

/**
 * Hook to create a new assessment
 */
export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) => createAssessment(data),

    onSuccess: (result) => {
      if (result.success) {
        // Invalidate và refetch tất cả queries liên quan
        queryClient.invalidateQueries({
          queryKey: ['scores']
        });
        queryClient.invalidateQueries({
          queryKey: ['score-stats']
        });
        queryClient.invalidateQueries({
          queryKey: ['student-score-stats']
        });
      }
    },

    onError: (error) => {
      console.error('Failed to create assessment:', error);
    }
  });
}
