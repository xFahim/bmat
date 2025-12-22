/**
 * User service types
 * Type definitions for user profile data and operations
 */

/**
 * User statistics from annotations
 */
export interface UserStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

/**
 * User annotation history item
 */
export interface UserAnnotation {
  id: string;
  caption: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  meme_id: number;
  storage_path: string;
  memeUrl: string;
}

/**
 * Result of fetching user stats
 */
export interface GetUserStatsResult {
  success: boolean;
  stats: UserStats | null;
  error: string | null;
}

/**
 * Result of fetching user history
 */
export interface GetUserHistoryResult {
  success: boolean;
  annotations: UserAnnotation[];
  error: string | null;
}

/**
 * Result of updating annotation
 */
export interface UpdateAnnotationResult {
  success: boolean;
  error: string | null;
}















