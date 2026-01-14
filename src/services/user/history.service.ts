/**
 * User history service
 * Handles fetching user annotation history
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserAnnotation, GetUserHistoryResult } from './types';
import { validateUserId } from './utils/validation';
import { constructMemeImageUrl } from '@/lib/annotate/utils/image-url';

/**
 * Gets user annotation history
 * @param supabase - Supabase client instance
 * @param userId - User ID to get history for
 * @returns User annotations or error
 */
export async function getUserHistory(
  supabase: SupabaseClient,
  userId: string
): Promise<GetUserHistoryResult> {
  try {
    // Security: Validate user ID
    const validationError = validateUserId(userId);
    if (validationError) {
      return {
        success: false,
        annotations: [],
        error: validationError,
      };
    }

    // Fetch annotations with joined meme data
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
      .eq('user_id', userId.trim())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching user history:', error);
      return {
        success: false,
        annotations: [],
        error: error.message || 'Failed to fetch user history',
      };
    }

    // Transform the data to match our interface
    const annotations = transformAnnotations(data || []);

    return {
      success: true,
      annotations,
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching user history:', error);
    return {
      success: false,
      annotations: [],
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
}

/**
 * Transforms raw annotation data from database to UserAnnotation format
 * @param data - Raw annotation data from Supabase
 * @returns Transformed annotations
 */
function transformAnnotations(
  data: Array<{
    id: string;
    caption: string;
    status: string;
    created_at: string;
    meme_id: number;
    memes: { storage_path: string } | { storage_path: string }[] | null;
  }>
): UserAnnotation[] {
  return data.map((item) => {
    // Handle both array and object responses from Supabase join
    const meme = Array.isArray(item.memes)
      ? item.memes[0]
      : (item.memes as { storage_path: string } | null);
    const storagePath = meme?.storage_path || '';

    return {
      id: item.id,
      caption: item.caption,
      status: item.status as 'pending' | 'approved' | 'rejected',
      created_at: item.created_at,
      meme_id: item.meme_id,
      storage_path: storagePath,
      memeUrl: storagePath ? constructMemeImageUrl(storagePath) : '',
    };
  });
}


















