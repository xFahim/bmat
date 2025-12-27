/**
 * Admin service types
 * Type definitions for admin operations
 */

import { User } from '@/types/users';

/**
 * User annotation statistics
 */
export interface UserStats {
  pending: number;
  approved: number;
  rejected: number;
}

/**
 * User with stats for admin dashboard
 */
export interface UserWithStats {
  user: User;
  stats: UserStats;
}

/**
 * Pending annotation with meme data
 */
export interface PendingAnnotation {
  id: string;
  memeId: number;
  memeUrl: string;
  caption: string;
  status: 'pending';
  created_at: string;
}

/**
 * Result of fetching all users
 */
export interface GetAllUsersResult {
  success: boolean;
  users: UserWithStats[];
  error: string | null;
}

/**
 * Result of fetching user details
 */
export interface GetUserDetailsResult {
  success: boolean;
  user: UserWithStats | null;
  error: string | null;
}

/**
 * Result of fetching pending annotations
 */
export interface GetPendingAnnotationsResult {
  success: boolean;
  annotations: PendingAnnotation[];
  error: string | null;
}

/**
 * Result of reviewing an annotation
 */
export interface ReviewAnnotationResult {
  success: boolean;
  error: string | null;
}

/**
 * Result of banning a user
 */
export interface BanUserResult {
  success: boolean;
  error: string | null;
}

















