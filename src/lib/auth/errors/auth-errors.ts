/**
 * Authentication error handling
 * Centralized error creation and handling
 */

import { AUTH_ERROR_CODES, AUTH_REDIRECT_PATHS } from "../constants";

/**
 * Creates a redirect URL with error query parameter
 * @param origin - Request origin
 * @param errorCode - Error code to include
 * @returns URL with error parameter
 */
export function createErrorRedirectUrl(origin: string, errorCode: string): URL {
  const url = new URL(AUTH_REDIRECT_PATHS.HOME, origin);
  url.searchParams.set("error", errorCode);
  return url;
}

/**
 * Creates a success redirect URL
 * @param origin - Request origin
 * @param path - Redirect path (validated)
 * @returns URL for redirect
 */
export function createSuccessRedirectUrl(origin: string, path: string): URL {
  return new URL(path, origin);
}

/**
 * Maps error to user-friendly message
 * @param errorCode - Error code
 * @returns User-friendly error message
 */
export function getErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    [AUTH_ERROR_CODES.UNAUTHORIZED_DOMAIN]:
      "Please use your BRACU G-Suite email.",
    [AUTH_ERROR_CODES.AUTH_ERROR]: "Authentication failed. Please try again.",
    [AUTH_ERROR_CODES.NO_EMAIL]: "No email found. Please try again.",
    [AUTH_ERROR_CODES.PROFILE_CREATION_FAILED]:
      "Failed to create profile. Please contact support.",
    [AUTH_ERROR_CODES.PROFILE_CHECK_FAILED]:
      "Failed to verify profile. Please try again.",
    [AUTH_ERROR_CODES.INVALID_REDIRECT]: "Invalid redirect path.",
  };

  return errorMessages[errorCode] || "An unexpected error occurred.";
}
