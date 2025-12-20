/**
 * User stats service
 * Handles fetching user statistics from annotations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserStats, GetUserStatsResult } from './types';
import { validateUserId } from './utils/validation';

/**
 * Gets user statistics from annotations
 * @param supabase - Supabase client instance
 * @param userId - User ID to get stats for
 * @returns User stats or error
 */
export async function getUserStats(
  supabase: SupabaseClient,
  userId: string
): Promise<GetUserStatsResult> {
  try {
    // Security: Validate user ID
    const validationError = validateUserId(userId);
    if (validationError) {
      return {
        success: false,
        stats: null,
        error: validationError,
      };
    }

    const trimmedUserId = userId.trim();

    // Fetch all counts in parallel
    const [totalResult, approvedResult, rejectedResult, pendingResult] =
      await Promise.all([
        getCountByStatus(supabase, trimmedUserId, null),
        getCountByStatus(supabase, trimmedUserId, 'approved'),
        getCountByStatus(supabase, trimmedUserId, 'rejected'),
        getCountByStatus(supabase, trimmedUserId, 'pending'),
      ]);

    // Check for errors
    if (totalResult.error) {
      return {
        success: false,
        stats: null,
        error: totalResult.error,
      };
    }

    if (approvedResult.error) {
      return {
        success: false,
        stats: null,
        error: approvedResult.error,
      };
    }

    if (rejectedResult.error) {
      return {
        success: false,
        stats: null,
        error: rejectedResult.error,
      };
    }

    if (pendingResult.error) {
      return {
        success: false,
        stats: null,
        error: pendingResult.error,
      };
    }

    return {
      success: true,
      stats: {
        total: totalResult.count || 0,
        approved: approvedResult.count || 0,
        rejected: rejectedResult.count || 0,
        pending: pendingResult.count || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error('Unexpected error fetching user stats:', error);
    return {
      success: false,
      stats: null,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
}

/**
 * Gets count of annotations by status
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param status - Status to filter by (null for all)
 * @returns Count and error
 */
async function getCountByStatus(
  supabase: SupabaseClient,
  userId: string,
  status: 'approved' | 'rejected' | 'pending' | null
): Promise<{ count: number | null; error: string | null }> {
  try {
    let query = supabase
      .from('annotations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { count, error } = await query;

    if (error) {
      const statusLabel = status || 'all';
      console.error(`Error fetching ${statusLabel} annotations:`, error);
      return {
        count: null,
        error: error.message || `Failed to fetch ${statusLabel} annotations`,
      };
    }

    return { count, error: null };
  } catch (error) {
    return {
      count: null,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
}











