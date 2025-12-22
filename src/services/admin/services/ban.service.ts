/**
 * Admin ban service
 * Handles user banning operations
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { BanUserResult } from '../types';
import { validateUserId } from '../utils/validation';

/**
 * Bans a user and rejects all their pending annotations
 * Uses the RPC function ban_user_and_reject_pending
 * @param supabase - Supabase client instance
 * @param userId - User ID to ban
 * @returns Success or error
 */
export async function banUser(
  supabase: SupabaseClient,
  userId: string
): Promise<BanUserResult> {
  try {
    // Validate input
    const validationError = validateUserId(userId);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const trimmedUserId = userId.trim();

    // Call the RPC function
    const { data, error } = await supabase.rpc('ban_user_and_reject_pending', {
      user_id_to_ban: trimmedUserId,
    });

    if (error) {
      console.error('[banUser] Error calling RPC:', error);
      return {
        success: false,
        error: error.message || 'Failed to ban user',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('[banUser] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}














