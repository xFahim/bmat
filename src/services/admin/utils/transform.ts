/**
 * Admin service transformation utilities
 * Helper functions for transforming database data to application types
 */

import type { UserWithStats } from '../types';
import { User } from '@/types/users';

/**
 * Profile data from database
 */
export interface ProfileData {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_banned: boolean | null;
}

/**
 * Transforms a profile with stats to UserWithStats
 * @param profile - Profile data from database
 * @param stats - User annotation stats
 * @returns UserWithStats object
 */
export function transformProfileToUserWithStats(
  profile: ProfileData,
  stats: { pending: number; approved: number; rejected: number }
): UserWithStats {
  return {
    user: {
      id: profile.id,
      name: profile.full_name || profile.email || 'Unknown',
      email: profile.email || '',
      avatar: profile.avatar_url || undefined,
      approved: stats.approved,
      rejected: stats.rejected,
      pending: stats.pending,
      status: profile.is_banned === true ? 'Banned' : 'Active',
    },
    stats,
  };
}








