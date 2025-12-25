/**
 * Admin annotation service
 * Handles annotation-related admin operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GetPendingAnnotationsResult,
  ReviewAnnotationResult,
  PendingAnnotation,
} from '../types';
import { validateUserId, validateAnnotationId, validateAnnotationStatus } from '../utils/validation';
import { constructMemeImageUrl } from '@/lib/annotate/utils/image-url';

/**
 * Fetches pending annotations for a user with meme data
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch pending annotations for
 * @returns Array of pending annotations with meme URLs
 */
export async function getPendingAnnotations(
  supabase: SupabaseClient,
  userId: string
): Promise<GetPendingAnnotationsResult> {
  try {
    // Validate input
    const validationError = validateUserId(userId);
    if (validationError) {
      return {
        success: false,
        annotations: [],
        error: validationError,
      };
    }

    const trimmedUserId = userId.trim();

    // Fetch pending annotations with joined meme data
    const { data, error } = await supabase
      .from('annotations')
      .select(
        `
        id,
        caption,
        status,
        created_at,
        meme_id,
        memes (
          storage_path
        )
      `
      )
      .eq('user_id', trimmedUserId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getPendingAnnotations] Error fetching annotations:', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        annotations: [],
        error: 'Failed to fetch pending annotations',
      };
    }

    // Transform the data
    const annotations: PendingAnnotation[] = (data || []).map((item) => {
      // Handle both array and object responses from Supabase join
      const meme = Array.isArray(item.memes)
        ? item.memes[0]
        : (item.memes as { storage_path: string } | null);
      const storagePath = meme?.storage_path || '';

      return {
        id: String(item.id),
        memeId: item.meme_id,
        memeUrl: storagePath ? constructMemeImageUrl(storagePath) : '',
        caption: item.caption,
        status: 'pending' as const,
        created_at: item.created_at,
      };
    });

    return {
      success: true,
      annotations,
      error: null,
    };
  } catch (error) {
    console.error('[getPendingAnnotations] Unexpected error:', error);
    return {
      success: false,
      annotations: [],
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Reviews an annotation (approves or rejects it)
 * @param supabase - Supabase client instance
 * @param annotationId - Annotation ID to review
 * @param status - New status ('approved' or 'rejected')
 * @param feedback - Optional feedback message
 * @returns Success or error
 */
export async function reviewAnnotation(
  supabase: SupabaseClient,
  annotationId: string,
  status: 'approved' | 'rejected',
  feedback?: string
): Promise<ReviewAnnotationResult> {
  try {
    // Validate inputs
    const annotationIdError = validateAnnotationId(annotationId);
    if (annotationIdError) {
      return {
        success: false,
        error: annotationIdError,
      };
    }

    const statusError = validateAnnotationStatus(status);
    if (statusError) {
      return {
        success: false,
        error: statusError,
      };
    }

    const trimmedAnnotationId = annotationId.trim();

    // Prepare update data
    const updateData: { status: string; feedback?: string } = {
      status,
    };

    if (feedback && feedback.trim().length > 0) {
      updateData.feedback = feedback.trim();
    }

    // Update annotation
    const { error } = await supabase
      .from('annotations')
      .update(updateData)
      .eq('id', trimmedAnnotationId);

    if (error) {
      console.error('[reviewAnnotation] Error updating annotation:', {
        code: error.code,
        message: error.message,
      });
      return {
        success: false,
        error: 'Failed to update annotation',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('[reviewAnnotation] Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}








