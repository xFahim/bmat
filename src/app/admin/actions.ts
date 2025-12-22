'use server';

import { createAdminClient } from "@/utils/supabase/admin";
import { getAllUsers, getOverallStats, getUserDetails } from "@/services/admin";
import { requireAdmin } from "@/lib/auth/utils/admin-auth";

/**
 * Server action to fetch dashboard data (users and stats)
 * Uses service role client to bypass RLS
 */
export async function getAdminDashboardData() {
  // Verify admin access
  await requireAdmin();

  // Create admin client with service role
  const adminClient = createAdminClient();

  // Fetch users and stats in parallel
  const [usersResult, statsResult] = await Promise.all([
    getAllUsers(adminClient),
    getOverallStats(adminClient),
  ]);

  // Return plain objects (serializeable)
  return {
    usersResult,
    statsResult
  };
}

// Export types for use in client
export type { AnnotationStatus } from "@/types/annotations";

/**
 * Server action to fetch user details
 * Uses service role client to bypass RLS
 */
export async function getAdminUserDetails(userId: string) {
  // Verify admin access
  await requireAdmin();

  // Create admin client with service role
  const adminClient = createAdminClient();

  const result = await getUserDetails(adminClient, userId);
  
  return result;
}

/**
 * Server action to fetch pending annotations for a user
 * Uses service role client to bypass RLS
 */
export async function getAdminPendingAnnotations(userId: string) {
  // Verify admin access
  await requireAdmin();

  // Create admin client with service role
  const adminClient = createAdminClient();

  // Note: We need to import getPendingAnnotations dynamically or ensure it's exported from "@/services/admin"
  const { getPendingAnnotations } = await import("@/services/admin");
  const result = await getPendingAnnotations(adminClient, userId);
  
  return result;
}

/**
 * Server action to review an annotation
 * Uses service role client to bypass RLS
 */
export async function adminReviewAnnotation(annotationId: string, status: "approved" | "rejected") {
  // Verify admin access
  await requireAdmin();

  // Create admin client with service role
  const adminClient = createAdminClient();

  const { reviewAnnotation } = await import("@/services/admin");
  const result = await reviewAnnotation(adminClient, annotationId, status);
  
  return result;
}

/**
 * Server action to ban a user
 * Uses service role client to bypass RLS
 */
export async function adminBanUser(userId: string) {
  // Verify admin access
  await requireAdmin();

  // Create admin client with service role
  const adminClient = createAdminClient();

  const { banUser } = await import("@/services/admin");
  const result = await banUser(adminClient, userId);
  
  return result;
}
