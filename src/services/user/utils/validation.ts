/**
 * Validation utilities for user service
 */

/**
 * Validates a user ID
 * @param userId - User ID to validate
 * @returns Error message if invalid, null if valid
 */
export function validateUserId(userId: unknown): string | null {
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
export function validateAnnotationId(annotationId: unknown): string | null {
  if (
    !annotationId ||
    typeof annotationId !== 'string' ||
    annotationId.trim().length === 0
  ) {
    return 'Invalid annotation ID';
  }
  return null;
}

/**
 * Validates a caption
 * @param caption - Caption to validate
 * @returns Error message if invalid, null if valid
 */
export function validateCaption(caption: unknown): string | null {
  if (
    !caption ||
    typeof caption !== 'string' ||
    caption.trim().length === 0
  ) {
    return 'Invalid caption';
  }
  return null;
}











