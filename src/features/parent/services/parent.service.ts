import { apiCall } from '@/features/auth/services/auth.service';
import type { ParentChildrenFullInfoResponse } from '@/features/parent/types';

interface ParentServiceError {
  message: string;
  status?: number;
}

export async function getParentChildrenFullInfo(termId: string): Promise<{
  data?: ParentChildrenFullInfoResponse;
  error?: ParentServiceError;
}> {
  try {
    const response = await apiCall(
      `/Score/parent/children/full-info/${termId}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: {
          message:
            (errorData && (errorData.message || errorData.error)) ||
            `Failed to fetch parent children full info: ${response.status}`,
          status: response.status
        }
      };
    }

    const data: ParentChildrenFullInfoResponse = await response.json();
    return { data };
  } catch (error: any) {
    console.error('❌ Error fetching parent children full info:', error);
    return {
      error: {
        message: error.message || 'Network error occurred',
        status: error.status
      }
    };
  }
}
