/**
 * User service
 * Main export file for user profile data fetching and updates
 */

// Types
export type {
  UserStats,
  UserAnnotation,
  GetUserStatsResult,
  GetUserHistoryResult,
  UpdateAnnotationResult,
} from './types';

// Services
export { getUserStats } from './stats.service';
export { getUserHistory } from './history.service';
export { updateAnnotation } from './update.service';

















