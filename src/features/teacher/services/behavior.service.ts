import { apiCall } from '@/features/auth/services/auth.service';
import type {
  CreateBehaviorNoteRequest,
  CreateBehaviorNoteResponse,
  UpdateBehaviorNoteRequest,
  UpdateBehaviorNoteResponse,
  DeleteBehaviorNoteResponse
} from '../types';

/**
 * Create a new behavior note for a student
 * @param data - Behavior note data
 */
export async function createBehaviorNote(
  data: CreateBehaviorNoteRequest
): Promise<CreateBehaviorNoteResponse> {
  try {
    const endpoint = '/BehaviorNote';

    console.log('🔄 Creating behavior note:', endpoint);

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
        errorData.message ||
          `Failed to create behavior note: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('✅ Behavior note created successfully:', result.id);

    return result;
  } catch (error: any) {
    console.error('❌ Error creating behavior note:', error);
    throw new Error(error.message || 'Failed to create behavior note');
  }
}

/**
 * Update an existing behavior note
 * @param data - Behavior note update data
 */
export async function updateBehaviorNote(
  data: UpdateBehaviorNoteRequest
): Promise<UpdateBehaviorNoteResponse> {
  try {
    const endpoint = `/BehaviorNote/${data.id}`;

    console.log('🔄 Updating behavior note:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: data.id,
        note: data.note,
        level: data.level
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to update behavior note: ${response.status}`
      );
    }

    const result = await response.json();
    console.log('✅ Behavior note updated successfully:', result.id);

    return result;
  } catch (error: any) {
    console.error('❌ Error updating behavior note:', error);
    throw new Error(error.message || 'Failed to update behavior note');
  }
}

/**
 * Delete a behavior note
 * @param noteId - The behavior note ID
 */
export async function deleteBehaviorNote(
  noteId: string
): Promise<DeleteBehaviorNoteResponse> {
  try {
    const endpoint = `/BehaviorNote/${noteId}`;

    console.log('🔄 Deleting behavior note:', endpoint);

    const response = await apiCall(endpoint, {
      method: 'DELETE',
      headers: {
        Accept: 'text/plain' // Specify that we expect text response
      }
    });

    if (!response.ok) {
      // Try to parse error as JSON first, fallback to text
      let errorMessage = `Failed to delete behavior note: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, try to get text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch {
          // Use default error message
        }
      }
      throw new Error(errorMessage);
    }

    // Get response as text since API returns "Note deleted successfully"
    const result = await response.text();
    console.log('✅ Behavior note deleted successfully:', noteId);

    return result;
  } catch (error: any) {
    console.error('❌ Error deleting behavior note:', error);
    throw new Error(error.message || 'Failed to delete behavior note');
  }
}
