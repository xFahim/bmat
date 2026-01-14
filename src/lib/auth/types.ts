/**
 * Authentication types
 * Type definitions for auth-related data structures
 */

import type { User } from '@supabase/supabase-js';

export interface AuthCallbackResult {
  success: boolean;
  error?: AuthError;
  redirectPath?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface UserProfileData {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}

export interface AuthSessionData {
  user: User;
  email: string;
}



















