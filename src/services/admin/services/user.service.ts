/**
 * Admin user service
 * Handles user-related admin operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  GetAllUsersResult,
  GetUserDetailsResult,
  UserWithStats,
} from '../types';
import { validateUserId } from '../utils/validation';
import { getUserAnnotationStats, getMultipleUserStats } from '../utils/stats';
import { transformProfileToUserWithStats, type ProfileData } from '../utils/transform';

/**
 * Fetches all users with their annotation stats
 * @param supabase - Supabase client instance
 * @returns Array of users with stats
 */
export async function getAllUsers(
  supabase: SupabaseClient
): Promise<GetAllUsersResult> {
  try {
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, is_banned')
      .order('full_name', { ascending: true });

    if (profilesError) {
      console.error('[getAllUsers] Error fetching profiles:', {
        code: profilesError.code,
        message: profilesError.message,
      });
      return {
        success: false,
        users: [],
        error: 'Failed to fetch users',
      };
    }

    if (!profiles || profiles.length === 0) {
      return {
        success: true,
        users: [],
        error: null,
      };
    }

    // Fetch annotation stats for all users in parallel
    const userIds = profiles.map((p) => p.id);
    const statsMap = await getMultipleUserStats(supabase, userIds);

    // Combine profiles with stats
    const usersWithStats: UserWithStats[] = profiles.map((profile) => {
      const stats = statsMap.get(profile.id) || { pending: 0, approved: 0, rejected: 0 };
      return transformProfileToUserWithStats(profile as ProfileData, stats);
    });

    return {
      success: true,
      users: usersWithStats,
      error: null,
    };
  } catch (error) {
    console.error('[getAllUsers] Unexpected error:', error);
    return {
      success: false,
      users: [],
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Fetches user details with stats
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch
 * @returns User with stats
 */
export async function getUserDetails(
  supabase: SupabaseClient,
  userId: string
): Promise<GetUserDetailsResult> {
  try {
    // Validate input
    const validationError = validateUserId(userId);
    if (validationError) {
      return {
        success: false,
        user: null,
        error: validationError,
      };
    }

    const trimmedUserId = userId.trim();

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, is_banned')
      .eq('id', trimmedUserId)
      .single();

    if (profileError) {
      console.error('[getUserDetails] Error fetching profile:', {
        code: profileError.code,
        message: profileError.message,
      });
      return {
        success: false,
        user: null,
        error: 'Failed to fetch user details',
      };
    }

    if (!profile) {
      return {
        success: false,
        user: null,
        error: 'User not found',
      };
    }

    // Fetch stats
    const stats = await getUserAnnotationStats(supabase, trimmedUserId);

    // Transform to UserWithStats
    const userWithStats = transformProfileToUserWithStats(
      profile as ProfileData,
      stats
    );

    return {
      success: true,
      user: userWithStats,
      error: null,
    };
  } catch (error) {
    console.error('[getUserDetails] Unexpected error:', error);
    return {
      success: false,
      user: null,
      error: 'An unexpected error occurred',
    };
  }
}








