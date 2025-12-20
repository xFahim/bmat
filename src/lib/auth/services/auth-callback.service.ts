/**
 * Auth callback service
 * Orchestrates the OAuth callback flow
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  exchangeCodeForSession,
  validateAndEnforceEmailDomain,
  extractUserProfileData,
} from "./auth.service";
import { ensureProfileExists } from "./profile.service";
import { validateRedirectPath } from "../validators/redirect";
import {
  createErrorRedirectUrl,
  createSuccessRedirectUrl,
} from "../errors/auth-errors";
import { AUTH_ERROR_CODES } from "../constants";
import { NextResponse } from "next/server";

/**
 * Handles the OAuth callback flow
 * @param supabase - Supabase client instance
 * @param code - OAuth authorization code
 * @param redirectPath - Optional redirect path after success
 * @param origin - Request origin for building redirect URLs
 * @returns NextResponse with redirect
 */
export async function handleAuthCallback(
  supabase: SupabaseClient,
  code: string,
  redirectPath: string | null,
  origin: string
): Promise<NextResponse> {
  try {
    // Exchange code for session
    const { user, email } = await exchangeCodeForSession(supabase, code);

    // Validate email domain and enforce sign-out if invalid
    const isValidDomain = await validateAndEnforceEmailDomain(supabase, email);
    if (!isValidDomain) {
      return NextResponse.redirect(
        createErrorRedirectUrl(origin, AUTH_ERROR_CODES.UNAUTHORIZED_DOMAIN)
      );
    }

    // Extract profile data from user
    const profileData = extractUserProfileData(user);

    // Ensure profile exists (create if needed)
    try {
      await ensureProfileExists(supabase, profileData);
    } catch (error) {
      console.error("Error ensuring profile exists:", error);
      return NextResponse.redirect(
        createErrorRedirectUrl(origin, AUTH_ERROR_CODES.PROFILE_CREATION_FAILED)
      );
    }

    // Validate and get redirect path
    const validatedPath = validateRedirectPath(redirectPath);

    // Success - redirect to validated path
    return NextResponse.redirect(
      createSuccessRedirectUrl(origin, validatedPath)
    );
  } catch (error) {
    console.error("Auth callback error:", error);

    // Determine error code based on error message
    let errorCode: string = AUTH_ERROR_CODES.AUTH_ERROR;
    if (error instanceof Error) {
      if (error.message.includes("email")) {
        errorCode = AUTH_ERROR_CODES.NO_EMAIL;
      }
    }

    return NextResponse.redirect(createErrorRedirectUrl(origin, errorCode));
  }
}
