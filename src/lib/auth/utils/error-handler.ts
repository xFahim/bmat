/**
 * Error handling utilities
 * Provides consistent error handling across auth flows
 */

import { AUTH_ERROR_CODES } from '../constants';
import { getErrorMessage } from '../errors/auth-errors';

/**
 * Maps error codes to user-friendly messages for frontend display
 * @param errorCode - Error code from query parameter
 * @returns Object with title and description for toast/notification
 */
export function getErrorDisplayInfo(errorCode: string | null) {
  if (!errorCode) {
    return null;
  }

  const message = getErrorMessage(errorCode);

  // Map specific error codes to user-friendly titles
  const errorTitles: Record<string, string> = {
    [AUTH_ERROR_CODES.UNAUTHORIZED_DOMAIN]: 'Access Denied',
    [AUTH_ERROR_CODES.AUTH_ERROR]: 'Authentication Failed',
    [AUTH_ERROR_CODES.NO_EMAIL]: 'Email Not Found',
    [AUTH_ERROR_CODES.PROFILE_CREATION_FAILED]: 'Profile Creation Failed',
    [AUTH_ERROR_CODES.PROFILE_CHECK_FAILED]: 'Profile Verification Failed',
    [AUTH_ERROR_CODES.INVALID_REDIRECT]: 'Invalid Redirect',
  };

  return {
    title: errorTitles[errorCode] || 'Error',
    description: message,
    variant: 'destructive' as const,
  };
}


















