/**
 * Annotation service
 * Handles annotation submission with validation and security checks
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubmitAnnotationResult } from '../types';
import { validateCaption, sanitizeCaption } from '../validators/caption';
import { releaseMemeLockRpc } from './meme-rpc.service';

/**
 * Submits an annotation to the database
 * @param supabase - Supabase client instance
 * @param memeId - ID of the meme being annotated
 * @param userId - ID of the user submitting the annotation
 * @param caption - Caption text to submit
 * @returns Result indicating success or error
 */
export async function submitAnnotation(
  supabase: SupabaseClient,
  memeId: number,
  userId: string,
  caption: string
): Promise<SubmitAnnotationResult> {
  try {
    // Security: Validate inputs
    if (!memeId || typeof memeId !== 'number' || memeId <= 0) {
      return {
        success: false,
        error: 'Invalid meme ID',
      };
    }

    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      return {
        success: false,
        error: 'Invalid user ID',
      };
    }

    // Validate and sanitize caption
    const validation = validateCaption(caption);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Invalid caption',
      };
    }

    const sanitizedCaption = sanitizeCaption(caption);

    // Call the RPC function
    const { error } = await supabase.rpc('submit_final_annotation', {
      p_meme_id: memeId,
      p_caption: sanitizedCaption,
      p_user_id: userId.trim(),
    });

    if (error) {
      console.error('[submitAnnotation] RPC error:', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      
      // Pass the raw error message back so the UI can handle specific cases
      // like "already been annotated"
      return {
        success: false,
        error: error.message, 
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('[submitAnnotation] Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Releases a meme reservation by clearing reserved_at and reserved_by
 * @param supabase - Supabase client instance
 * @param memeId - ID of the meme to release
 */
export async function releaseMemeReservation(
  supabase: SupabaseClient,
  memeId: number
): Promise<void> {
  try {
    const { error } = await releaseMemeLockRpc(supabase, memeId);

    if (error) {
      console.error('[releaseMemeReservation] Failed to release reservation:', error);
    }
  } catch (error) {
    console.error('[releaseMemeReservation] Unexpected error:', error);
  }
}








