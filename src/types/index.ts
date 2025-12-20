/**
 * Shared type definitions for the application
 */

export interface FloatingLetter {
  letter: string;
  top: string;
  left: string;
  rotation: number;
  opacity: number;
  size: string;
  delay: number;
}

// Re-export types from other modules
export * from "./annotations";
export * from "./users";

