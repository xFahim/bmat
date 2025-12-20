/**
 * Admin service
 * Main export file for admin operations
 * All Supabase operations for admin dashboard are centralized here
 */

// Export types
export type {
  UserStats,
  UserWithStats,
  PendingAnnotation,
  GetAllUsersResult,
  GetUserDetailsResult,
  GetPendingAnnotationsResult,
  ReviewAnnotationResult,
  BanUserResult,
} from "./types";

// Export user services
export { getAllUsers, getUserDetails } from "./services/user.service";

// Export annotation services
export {
  getPendingAnnotations,
  reviewAnnotation,
} from "./services/annotation.service";

// Export ban services
export { banUser } from "./services/ban.service";

// Export stats services
export { getOverallStats } from "./services/stats.service";
export type { OverallStatsResult } from "./services/stats.service";
