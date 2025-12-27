/**
 * Admin service validation utilities
 * Input validation helpers for admin operations
 */

/**
 * Validates a user ID
 * @param userId - User ID to validate
 * @returns Error message if invalid, null if valid
 */
export function validateUserId(userId: string): string | null {
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return 'Invalid user ID';
  }
  return null;
}

/**
 * Validates an annotation ID
 * @param annotationId - Annotation ID to validate
 * @returns Error message if invalid, null if valid
 */
export function validateAnnotationId(annotationId: string): string | null {
  if (!annotationId || typeof annotationId !== 'string' || annotationId.trim().length === 0) {
    return 'Invalid annotation ID';
  }
  return null;
}

/**
 * Validates an annotation status
 * @param status - Status to validate
 * @returns Error message if invalid, null if valid
 */
export function validateAnnotationStatus(status: string): string | null {
  if (status !== 'approved' && status !== 'rejected') {
    return 'Invalid status. Must be "approved" or "rejected"';
  }
  return null;
}

















