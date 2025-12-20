import { updateSession } from '@/utils/supabase/middleware'
import { type NextRequest } from 'next/server'

/**
 * Next.js Middleware
 * Handles Supabase session management and route protection
 * 
 * This middleware runs on every request and:
 * - Refreshes Supabase sessions automatically
 * - Redirects authenticated users away from home page
 * - Protects routes that require authentication
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}











