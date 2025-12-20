/**
 * Toast Helpers
 * Utility functions for toast notifications
 */

export interface ToastConfig {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

/**
 * Creates a toast configuration for authentication errors
 */
export function createAuthErrorToast(): ToastConfig {
  return {
    variant: "destructive",
    title: "Authentication Error",
    description: "Failed to get user information. Please refresh the page.",
  };
}

/**
 * Creates a toast configuration for validation errors
 */
export function createValidationErrorToast(message: string): ToastConfig {
  return {
    variant: "destructive",
    title: "Validation Error",
    description: message,
  };
}

/**
 * Creates a toast configuration for general errors
 */
export function createErrorToast(message: string): ToastConfig {
  return {
    variant: "destructive",
    title: "Error",
    description: message,
  };
}

/**
 * Creates a toast configuration for success messages
 */
export function createSuccessToast(
  title: string = "Saved",
  description: string = "Your annotation has been saved successfully."
): ToastConfig {
  return {
    title,
    description,
    variant: "default",
  };
}








