import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudentBehaviorNotes,
  transformBehaviorNotes,
  computeBehaviorSummary
} from '@/features/student/services/behavior.service';
import {
  createBehaviorNote,
  updateBehaviorNote,
  deleteBehaviorNote
} from '../services/behavior.service';
import type {
  CreateBehaviorNoteRequest,
  UpdateBehaviorNoteRequest
} from '../types';

export const behaviorKeys = {
  all: ['behavior'] as const,
  byStudent: (studentId: string) => [...behaviorKeys.all, studentId] as const
};

/**
 * Hook to fetch behavior notes for a specific student
 * @param studentId - The student ID
 * @param options - React Query options
 */
export function useStudentBehaviorNotes(
  studentId: string,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) {
  return useQuery({
    queryKey: behaviorKeys.byStudent(studentId),
    enabled: !!studentId && options?.enabled !== false,
    queryFn: async () => {
      const response = await getStudentBehaviorNotes(studentId);
      const notes = transformBehaviorNotes(response || []);
      const summary = computeBehaviorSummary(notes);
      return { notes, summary };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * Hook to create a new behavior note
 */
export function useCreateBehaviorNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBehaviorNote,
    onSuccess: (data) => {
      // Invalidate and refetch behavior notes for the student
      queryClient.invalidateQueries({
        queryKey: behaviorKeys.byStudent(data.studentId)
      });
    },
    onError: (error) => {
      console.error('Failed to create behavior note:', error);
    }
  });
}

/**
 * Hook to update a behavior note
 */
export function useUpdateBehaviorNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBehaviorNote,
    onSuccess: (data) => {
      // Invalidate and refetch behavior notes for the student
      queryClient.invalidateQueries({
        queryKey: behaviorKeys.byStudent(data.studentId)
      });
    },
    onError: (error) => {
      console.error('Failed to update behavior note:', error);
    }
  });
}

/**
 * Hook to delete a behavior note
 */
export function useDeleteBehaviorNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBehaviorNote,
    onSuccess: (data, noteId) => {
      // Invalidate all behavior note queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: behaviorKeys.all
      });
    },
    onError: (error) => {
      console.error('Failed to delete behavior note:', error);
    }
  });
}
