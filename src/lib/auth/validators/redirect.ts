/**
 * Redirect URL validation utilities
 * Prevents open redirect vulnerabilities
 */

import { AUTH_REDIRECT_PATHS } from '../constants';

/**
 * Allowed redirect paths for authentication
 */
const ALLOWED_REDIRECT_PATHS = [
  AUTH_REDIRECT_PATHS.ANNOTATE,
  AUTH_REDIRECT_PATHS.HOME,
] as const;

/**
 * Validates if a redirect path is safe and allowed
 * Prevents open redirect attacks by only allowing predefined paths
 * 
 * @param path - The redirect path to validate
 * @returns The validated path or default path if invalid
 */
export function validateRedirectPath(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') {
    return AUTH_REDIRECT_PATHS.ANNOTATE;
  }

  // Remove query parameters and hash to prevent injection
  const cleanPath = path.split('?')[0].split('#')[0].trim();

  // Prevent path traversal attacks
  if (cleanPath.includes('..') || cleanPath.includes('//') || cleanPath.includes('\\')) {
    return AUTH_REDIRECT_PATHS.ANNOTATE;
  }

  // Ensure path starts with / (relative path)
  if (!cleanPath.startsWith('/')) {
    return AUTH_REDIRECT_PATHS.ANNOTATE;
  }

  // Check if path exactly matches an allowed path
  if (ALLOWED_REDIRECT_PATHS.includes(cleanPath as any)) {
    return cleanPath;
  }

  // For nested routes, validate more strictly
  // Only allow paths that start with allowed path AND don't contain dangerous characters
  const isAllowedNestedPath = ALLOWED_REDIRECT_PATHS.some(allowedPath => {
    if (cleanPath === allowedPath) {
      return true;
    }
    // Only allow nested paths that are direct children (e.g., /annotate/something)
    // Prevent paths like /annotate/../../evil
    if (cleanPath.startsWith(allowedPath + '/')) {
      const remaining = cleanPath.substring(allowedPath.length + 1);
      // Ensure remaining path doesn't contain path traversal
      if (!remaining.includes('..') && !remaining.includes('//') && !remaining.includes('\\')) {
        return true;
      }
    }
    return false;
  });

  if (isAllowedNestedPath) {
    return cleanPath;
  }

  // Default to annotate page if path is not allowed
  return AUTH_REDIRECT_PATHS.ANNOTATE;
}

/**
 * Validates if a URL is safe for redirect (same origin)
 * @param url - The URL to validate
 * @param origin - The expected origin
 * @returns true if URL is safe, false otherwise
 */
export function isValidRedirectUrl(url: string, origin: string): boolean {
  try {
    const urlObj = new URL(url, origin);
    return urlObj.origin === origin;
  } catch {
    return false;
  }
}









