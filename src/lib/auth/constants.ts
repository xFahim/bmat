/**
 * Authentication constants
 * Centralized configuration for auth-related values
 */

export const ALLOWED_EMAIL_DOMAIN = "@g.bracu.ac.bd" as const;

export const AUTH_REDIRECT_PATHS = {
  HOME: "/",
  ANNOTATE: "/annotate",
  CALLBACK: "/auth/callback",
} as const;

export const AUTH_ERROR_CODES = {
  UNAUTHORIZED_DOMAIN: "unauthorized_domain",
  AUTH_ERROR: "auth_error",
  NO_EMAIL: "no_email",
  PROFILE_CREATION_FAILED: "profile_creation_failed",
  PROFILE_CHECK_FAILED: "profile_check_failed",
  INVALID_REDIRECT: "invalid_redirect",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
