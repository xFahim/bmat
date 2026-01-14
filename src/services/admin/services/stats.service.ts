/**
 * Admin stats service
 * Handles fetching overall statistics for admin dashboard
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Overall statistics result
 */
export interface OverallStatsResult {
  success: boolean;
  stats: {
    totalRaw: number; // Total memes in database
    totalDone: number; // Total approved + rejected annotations
    totalPending: number; // Total pending annotations
  } | null;
  error: string | null;
}

/**
 * Fetches overall statistics for admin dashboard
 * @param supabase - Supabase client instance
 * @returns Overall statistics
 */
export async function getOverallStats(
  supabase: SupabaseClient
): Promise<OverallStatsResult> {
  try {
    // Fetch all stats in parallel
    const [memesResult, approvedResult, rejectedResult, pendingResult] =
      await Promise.all([
        // Total raw memes (total memes in database)
        supabase
          .from('memes')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        // Total approved annotations
        supabase
          .from('annotations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved'),
        // Total rejected annotations
        supabase
          .from('annotations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected'),
        // Total pending annotations
        supabase
          .from('annotations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ]);

    // Check for errors
    if (memesResult.error) {
      console.error('[getOverallStats] Error fetching memes count:', memesResult.error);
      return {
        success: false,
        stats: null,
        error: memesResult.error.message || 'Failed to fetch memes count',
      };
    }

    if (approvedResult.error) {
      console.error('[getOverallStats] Error fetching approved count:', approvedResult.error);
      return {
        success: false,
        stats: null,
        error: approvedResult.error.message || 'Failed to fetch approved count',
      };
    }

    if (rejectedResult.error) {
      console.error('[getOverallStats] Error fetching rejected count:', rejectedResult.error);
      return {
        success: false,
        stats: null,
        error: rejectedResult.error.message || 'Failed to fetch rejected count',
      };
    }

    if (pendingResult.error) {
      console.error('[getOverallStats] Error fetching pending count:', pendingResult.error);
      return {
        success: false,
        stats: null,
        error: pendingResult.error.message || 'Failed to fetch pending count',
      };
    }

    const totalRaw = memesResult.count || 0;
    const totalDone = (approvedResult.count || 0) + (rejectedResult.count || 0);
    const totalPending = pendingResult.count || 0;

    return {
      success: true,
      stats: {
        totalRaw,
        totalDone,
        totalPending,
      },
      error: null,
    };
  } catch (error) {
    console.error('[getOverallStats] Unexpected error:', error);
    return {
      success: false,
      stats: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}


















