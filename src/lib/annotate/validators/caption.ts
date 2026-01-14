/**
 * Caption validators
 * Validates annotation caption input
 */

/**
 * Maximum allowed caption length
 */
export const MAX_CAPTION_LENGTH = 5000;

/**
 * Minimum required caption length
 */
export const MIN_CAPTION_LENGTH = 1;

/**
 * Validates a caption string
 * @param caption - Caption to validate
 * @returns Object with isValid flag and error message if invalid
 */
export function validateCaption(caption: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = caption.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Caption cannot be empty',
    };
  }

  if (trimmed.length < MIN_CAPTION_LENGTH) {
    return {
      isValid: false,
      error: `Caption must be at least ${MIN_CAPTION_LENGTH} character long`,
    };
  }

  if (trimmed.length > MAX_CAPTION_LENGTH) {
    return {
      isValid: false,
      error: `Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes caption input by trimming whitespace
 * @param caption - Caption to sanitize
 * @returns Sanitized caption
 */
export function sanitizeCaption(caption: string): string {
  return caption.trim();
}


















