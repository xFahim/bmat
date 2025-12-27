/**
 * Validation Helpers
 * Utility functions for form validation
 */

/**
 * Validates caption input
 * @param caption - Caption text to validate
 * @returns Error message if invalid, null if valid
 */
export function validateCaptionInput(caption: string): string | null {
  if (!caption.trim()) {
    return "Please enter a caption before submitting.";
  }
  return null;
}

/**
 * Validates that required data is present for submission
 * @param meme - Meme object
 * @param userId - User ID
 * @returns Error message if invalid, null if valid
 */
export function validateSubmissionData(
  meme: unknown,
  userId: string | null
): string | null {
  if (!meme) {
    return "Missing meme information.";
  }
  if (!userId) {
    return "Missing user information.";
  }
  return null;
}

















