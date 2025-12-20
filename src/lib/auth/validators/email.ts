/**
 * Email validation utilities
 * Handles email domain validation for authentication
 */

/**
 * Validates if an email belongs to the allowed domain
 * @param email - The email address to validate
 * @returns true if email ends with an allowed domain (student or faculty), false otherwise
 */
export function isValidEmailDomain(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Trim whitespace and convert to lowercase for consistent comparison
  const normalizedEmail = email.trim().toLowerCase();

  // Check for both student and faculty domains
  const isStudent = normalizedEmail.endsWith("@g.bracu.ac.bd");
  const isFaculty = normalizedEmail.endsWith("@bracu.ac.bd");

  return isStudent || isFaculty;
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
