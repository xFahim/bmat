/**
 * User Session Service
 * Handles user authentication and session count operations
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface UserSessionResult {
  user: { id: string } | null;
  sessionCount: number;
  error: string | null;
}

/**
 * Initializes user session and fetches session count
 * @param supabase - Supabase client instance
 * @returns User and session count or error
 */
export async function initializeUserSession(
  supabase: SupabaseClient
): Promise<UserSessionResult> {
  try {
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Error getting user:", authError);
      return {
        user: null,
        sessionCount: 0,
        error: authError.message || "Failed to get user information",
      };
    }

    if (!currentUser) {
      return {
        user: null,
        sessionCount: 0,
        error: null,
      };
    }

    // Fetch session count (total annotations)
    const { count, error: countError } = await supabase
      .from("annotations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id);

    if (countError) {
      console.error("Error fetching session count:", countError);
      // Don't fail the whole operation if count fails
    }

    return {
      user: { id: currentUser.id },
      sessionCount: count || 0,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error initializing user session:", error);
    return {
      user: null,
      sessionCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

















