/**
 * Annotation types
 * Type definitions for annotation-related data structures
 */

/**
 * Meme data structure from database
 */
export interface Meme {
  id: number;
  storage_path: string;
  annotation_count: number;
  source_folder: string;
}

/**
 * Annotation data structure for submission
 */
export interface AnnotationData {
  meme_id: number;
  user_id: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Result of fetching next meme
 */
export interface FetchMemeResult {
  success: boolean;
  meme: Meme | null;
  error?: string;
}

/**
 * Result of submitting annotation
 */
export interface SubmitAnnotationResult {
  success: boolean;
  error?: string;
}















