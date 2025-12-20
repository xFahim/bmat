/**
 * File validation utilities
 * Handles secure file upload validation
 */

/**
 * Allowed MIME types for image uploads
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Maximum filename length
 */
const MAX_FILENAME_LENGTH = 255;

/**
 * Validates file type by checking MIME type
 * @param file - File object to validate
 * @returns true if file type is valid, false otherwise
 */
export function isValidFileType(file: File): boolean {
  return ALLOWED_MIME_TYPES.includes(file.type as any);
}

/**
 * Validates file size
 * @param file - File object to validate
 * @returns true if file size is within limits, false otherwise
 */
export function isValidFileSize(file: File): boolean {
  return file.size > 0 && file.size <= MAX_FILE_SIZE;
}

/**
 * Sanitizes a filename to prevent path traversal and other attacks
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed_file';
  }

  // Remove path separators and dangerous characters
  let sanitized = filename
    .replace(/[\/\\]/g, '_') // Replace slashes
    .replace(/\.\./g, '_') // Replace path traversal
    .replace(/[<>:"|?*]/g, '_') // Replace Windows reserved characters
    .replace(/\s+/g, '_') // Replace spaces
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, ''); // Remove trailing dots

  // Limit length
  if (sanitized.length > MAX_FILENAME_LENGTH) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    sanitized = sanitized.substring(0, MAX_FILENAME_LENGTH - ext.length) + ext;
  }

  // Ensure it's not empty
  if (!sanitized || sanitized.length === 0) {
    sanitized = 'unnamed_file';
  }

  return sanitized;
}

/**
 * Validates source group name
 * @param sourceGroup - Source group string to validate
 * @returns Validation result
 */
export function validateSourceGroup(sourceGroup: string): {
  isValid: boolean;
  error?: string;
} {
  if (!sourceGroup || typeof sourceGroup !== 'string') {
    return {
      isValid: false,
      error: 'Source group is required',
    };
  }

  const trimmed = sourceGroup.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Source group cannot be empty',
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      error: 'Source group cannot exceed 100 characters',
    };
  }

  // Only allow alphanumeric, spaces, hyphens, and underscores
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Source group can only contain letters, numbers, spaces, hyphens, and underscores',
    };
  }

  return { isValid: true };
}

/**
 * Validates a file upload
 * @param file - File object to validate
 * @returns Validation result with error message if invalid
 */
export function validateFileUpload(file: File): {
  isValid: boolean;
  error?: string;
} {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided',
    };
  }

  // Check file size
  if (!isValidFileSize(file)) {
    if (file.size === 0) {
      return {
        isValid: false,
        error: 'File is empty',
      };
    }
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!isValidFileType(file)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  // Validate filename
  const sanitized = sanitizeFilename(file.name);
  if (!sanitized || sanitized === 'unnamed_file') {
    return {
      isValid: false,
      error: 'Invalid filename',
    };
  }

  return { isValid: true };
}

/**
 * Gets maximum file size in bytes
 */
export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}

/**
 * Gets allowed MIME types
 */
export function getAllowedMimeTypes(): readonly string[] {
  return ALLOWED_MIME_TYPES;
}




