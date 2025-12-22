'use server';

import { checkAdminStatus } from "@/lib/auth/utils/admin-auth";

/**
 * Server action to check if the current user is an admin.
 * Returns true if admin, false otherwise.
 */
export async function checkUserAdminStatus() {
  const result = await checkAdminStatus();
  return !!result?.isAdmin;
}
