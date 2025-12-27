/**
 * Admin authorization utilities
 * Handles admin role verification and authorization checks
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

/**
 * Admin email addresses that have admin privileges
 * In production, this should be stored in the database or environment variables
 */
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

/**
 * Checks if a user is an admin
 * First checks if email is in ADMIN_EMAILS list
 * Then checks if user has is_admin flag in profiles table (if exists)
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @param userEmail - User email to check
 * @returns true if user is admin, false otherwise
 */
export async function isUserAdmin(
  supabase: SupabaseClient,
  userId: string,
  userEmail: string | null | undefined
): Promise<boolean> {
  try {
    // Check email against admin list (fast check)
    if (userEmail && ADMIN_EMAILS.length > 0) {
      const normalizedEmail = userEmail.trim().toLowerCase();
      if (ADMIN_EMAILS.includes(normalizedEmail)) {
        return true;
      }
    }

    // Check database for is_admin flag (if column exists)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (!error && data && (data as any).is_admin === true) {
        return true;
      }
    } catch (dbError) {
      // Column might not exist, that's okay - fall back to email check
      console.warn('[isUserAdmin] Could not check is_admin column:', dbError);
    }

    return false;
  } catch (error) {
    console.error('[isUserAdmin] Error checking admin status:', error);
    return false;
  }
}

/**
 * Verifies that the current authenticated user is an admin
 * Throws an error if user is not authenticated or not an admin
 * @param request - Request object (optional, for server components)
 * @returns Object with user and admin status
 */
export async function requireAdmin(): Promise<{
  user: { id: string; email: string | null };
  isAdmin: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized: Authentication required');
  }

  const isAdmin = await isUserAdmin(supabase, user.id, user.email);

  if (!isAdmin) {
    throw new Error('Forbidden: Admin access required');
  }

  return {
    user: {
      id: user.id,
      email: user.email || null,
    },
    isAdmin: true,
  };
}

/**
 * Checks if current user is admin (non-throwing version)
 * @returns Object with user and admin status, or null if not authenticated
 */
export async function checkAdminStatus(): Promise<{
  user: { id: string; email: string | null };
  isAdmin: boolean;
} | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}










