/**
 * Admin service stats utilities
 * Helper functions for calculating user statistics
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserStats } from '../types';

/**
 * Fetches annotation counts for a single user by status
 * @param supabase - Supabase client instance
 * @param userId - User ID to get stats for
 * @returns User stats
 */
export async function getUserAnnotationStats(
  supabase: SupabaseClient,
  userId: string
): Promise<UserStats> {
  const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
    supabase
      .from('annotations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending'),
    supabase
      .from('annotations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'approved'),
    supabase
      .from('annotations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'rejected'),
  ]);

  return {
    pending: pendingResult.count || 0,
    approved: approvedResult.count || 0,
    rejected: rejectedResult.count || 0,
  };
}

/**
 * Fetches annotation stats for multiple users in parallel
 * @param supabase - Supabase client instance
 * @param userIds - Array of user IDs to get stats for
 * @returns Map of user ID to stats
 */
export async function getMultipleUserStats(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Map<string, UserStats>> {
  const statsPromises = userIds.map(async (userId) => {
    const stats = await getUserAnnotationStats(supabase, userId);
    return { userId, stats };
  });

  const statsArray = await Promise.all(statsPromises);
  return new Map(statsArray.map((s) => [s.userId, s.stats]));
}











