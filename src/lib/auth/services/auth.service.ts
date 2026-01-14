/**
 * Authentication service
 * Handles core authentication business logic
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import { isValidEmailDomain } from '../validators/email';
import { AUTH_ERROR_CODES } from '../constants';
import type { AuthSessionData, AuthError } from '../types';

/**
 * Exchanges an OAuth code for a session
 * @param supabase - Supabase client instance
 * @param code - OAuth authorization code
 * @returns Session data with user and email
 */
export async function exchangeCodeForSession(
  supabase: SupabaseClient,
  code: string
): Promise<AuthSessionData> {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw new Error(`Failed to exchange code for session: ${error.message}`);
  }

  const user = data.user;
  const email = user?.email;

  if (!user || !email) {
    throw new Error('No user or email found in session');
  }

  return { user, email };
}

/**
 * Validates user email domain and signs out if invalid
 * @param supabase - Supabase client instance
 * @param email - User email to validate
 * @returns true if email is valid, false otherwise
 */
export async function validateAndEnforceEmailDomain(
  supabase: SupabaseClient,
  email: string
): Promise<boolean> {
  if (!isValidEmailDomain(email)) {
    // Sign out immediately if email is invalid
    await supabase.auth.signOut();
    return false;
  }

  return true;
}

/**
 * Extracts user profile data from Supabase user object
 * @param user - Supabase user object
 * @returns User profile data
 */
export function extractUserProfileData(user: User): {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
} {
  return {
    id: user.id,
    email: user.email || '',
    full_name: 
      user.user_metadata?.full_name || 
      user.user_metadata?.name || 
      user.user_metadata?.display_name || 
      '',
    avatar_url: 
      user.user_metadata?.avatar_url || 
      user.user_metadata?.picture || 
      null,
  };
}



















