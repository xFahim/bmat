/**
 * Email validation utilities
 * Handles email domain validation for authentication
 */

/**
 * Validates if an email is allowed for authentication.
 *
 * Previously this enforced BRAC-only domains (e.g. @g.bracu.ac.bd).
 * Now it simply checks for a syntactically valid email address so that
 * any external account (e.g. normal Gmail) can sign in.
 *
 * @param email - The email address to validate
 * @returns true if email format is valid, false otherwise
 */
export function isValidEmailDomain(email: string | null | undefined): boolean {
  return isValidEmailFormat(email);
}

/**
 * Validates email format (basic validation)
 * @param email - The email address to validate
 * @returns true if email format is valid, false otherwise
 */
export function isValidEmailFormat(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}
