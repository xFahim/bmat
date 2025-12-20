import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { handleAuthCallback } from '@/lib/auth/services/auth-callback.service'
import { AUTH_REDIRECT_PATHS } from '@/lib/auth/constants'
import { createErrorRedirectUrl } from '@/lib/auth/errors/auth-errors'

/**
 * OAuth callback route handler
 * Handles the OAuth callback from Google authentication
 * 
 * Security considerations:
 * - Validates redirect paths to prevent open redirects
 * - Validates email domain before allowing access
 * - Handles errors gracefully without exposing sensitive information
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  // Validate that we have an authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL(AUTH_REDIRECT_PATHS.HOME, requestUrl.origin)
    )
  }

  // Create Supabase client
  const supabase = await createClient()

  // Handle the callback flow using the service layer
  return handleAuthCallback(supabase, code, next, requestUrl.origin)
}

