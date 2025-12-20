/**
 * Client-side authentication service
 * Handles OAuth login from the frontend
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { AUTH_REDIRECT_PATHS } from '../constants';

/**
 * Initiates Google OAuth login flow
 * @param supabase - Supabase client instance
 * @param redirectOrigin - Origin for the redirect URL
 * @returns Promise that resolves when OAuth flow is initiated
 */
export async function signInWithGoogle(
  supabase: SupabaseClient,
  redirectOrigin: string
): Promise<{ error: Error | null }> {
  try {
    // Ensure we have a valid origin (no trailing slash)
    const cleanOrigin = redirectOrigin.replace(/\/$/, '');
    const redirectTo = `${cleanOrigin}${AUTH_REDIRECT_PATHS.CALLBACK}`;

    console.log('OAuth redirect URL:', redirectTo);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error during Google sign-in:', error);
    return {
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}

/**
 * Signs out the current user
 * @param supabase - Supabase client instance
 * @returns Promise that resolves when sign out is complete
 */
export async function signOut(
  supabase: SupabaseClient
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error during sign out:', error);
    return {
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}


