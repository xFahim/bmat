/**
 * Annotation service
 * Handles annotation submission with validation and security checks
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubmitAnnotationResult } from '../types';
import { validateCaption, sanitizeCaption } from '../validators/caption';

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

    // Insert annotation into database
    const { error } = await supabase.from('annotations').insert({
      meme_id: memeId,
      user_id: userId.trim(),
      caption: sanitizedCaption,
      status: 'pending',
    });

    if (error) {
      console.error('[submitAnnotation] Database error:', {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      
      // Handle specific database errors without exposing internal details
      if (error.code === '23505') {
        // Unique constraint violation (user already annotated this meme)
        return {
          success: false,
          error: 'You have already annotated this meme',
        };
      }

      if (error.code === '23503') {
        // Foreign key constraint violation
        return {
          success: false,
          error: 'Invalid meme or user reference',
        };
      }

      // Generic error - don't expose internal error messages
      return {
        success: false,
        error: 'Failed to save annotation. Please try again.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('[submitAnnotation] Unexpected error:', error);
    // Don't expose error details to client
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}








