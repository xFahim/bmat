/**
 * Annotation update service
 * Handles updating annotation captions
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UpdateAnnotationResult } from './types';
import {
  validateAnnotationId,
  validateCaption,
} from './utils/validation';

/**
 * Updates an annotation caption
 * Only allowed if status is 'pending'
 * @param supabase - Supabase client instance
 * @param annotationId - Annotation ID to update
 * @param newCaption - New caption text
 * @returns Success or error
 */
export async function updateAnnotation(
  supabase: SupabaseClient,
  annotationId: string,
  newCaption: string
): Promise<UpdateAnnotationResult> {
  try {
    // Security: Validate inputs
    const annotationIdError = validateAnnotationId(annotationId);
    if (annotationIdError) {
      return {
        success: false,
        error: annotationIdError,
      };
    }

    const captionError = validateCaption(newCaption);
    if (captionError) {
      return {
        success: false,
        error: captionError,
      };
    }

    const trimmedAnnotationId = annotationId.trim();
    const trimmedCaption = newCaption.trim();

    // Check if annotation exists and is pending
    const statusCheckResult = await checkAnnotationStatus(
      supabase,
      trimmedAnnotationId
    );

    if (!statusCheckResult.success) {
      return statusCheckResult;
    }

    if (statusCheckResult.status !== 'pending') {
      return {
        success: false,
        error: 'Only pending annotations can be updated',
      };
    }

    // Update the caption
    const { error: updateError } = await supabase
      .from('annotations')
      .update({ caption: trimmedCaption })
      .eq('id', trimmedAnnotationId)
      .eq('status', 'pending'); // Extra safety check

    if (updateError) {
      console.error('Error updating annotation:', updateError);
      return {
        success: false,
        error: updateError.message || 'Failed to update annotation',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error updating annotation:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
}

/**
 * Checks if annotation exists and returns its status
 * @param supabase - Supabase client instance
 * @param annotationId - Annotation ID to check
 * @returns Status check result
 */
async function checkAnnotationStatus(
  supabase: SupabaseClient,
  annotationId: string
): Promise<
  | { success: true; status: 'pending' | 'approved' | 'rejected' }
  | { success: false; error: string }
> {
  const { data: annotation, error: fetchError } = await supabase
    .from('annotations')
    .select('status')
    .eq('id', annotationId)
    .single();

  if (fetchError) {
    console.error('Error fetching annotation:', fetchError);
    return {
      success: false,
      error: fetchError.message || 'Failed to fetch annotation',
    };
  }

  if (!annotation) {
    return {
      success: false,
      error: 'Annotation not found',
    };
  }

  return {
    success: true,
    status: annotation.status as 'pending' | 'approved' | 'rejected',
  };
}














