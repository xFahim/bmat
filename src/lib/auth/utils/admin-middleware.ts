/**
 * Admin middleware utilities
 * Server-side admin route protection
 */

import { createClient } from '@/utils/supabase/server';
import { isUserAdmin } from './admin-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Protects admin routes by checking if user is admin
 * Use this in API routes or server components
 * @param request - Request object
 * @returns Admin user data or redirects if not admin
 */
export async function protectAdminRoute(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const isAdmin = await isUserAdmin(supabase, user.id, user.email);

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return null; // User is admin, allow access
}








