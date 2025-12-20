/**
 * Authentication hook
 * Provides authentication utilities for client components
 */

import { useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { signInWithGoogle, signOut } from '@/lib/auth/services/auth-client.service';

/**
 * Hook for authentication operations
 * @returns Object with authentication methods
 */
export function useAuth() {
  const handleGoogleLogin = useCallback(async () => {
    const supabase = createClient();
    
    // Get origin from window.location (works in browser)
    // Fallback to environment variable for production if needed
    const origin = 
      typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || '';
    
    if (!origin) {
      const error = new Error('Unable to determine site origin. Please check your configuration.');
      console.error('Authentication error:', error);
      throw error;
    }
    
    console.log('Using redirect origin:', origin);
    
    const { error } = await signInWithGoogle(supabase, origin);
    
    if (error) {
      console.error('Authentication error:', error);
      // Error handling can be extended here (e.g., show toast notification)
      throw error;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    
    const { error } = await signOut(supabase);
    
    if (error) {
      console.error('Sign out error:', error);
      // Error handling can be extended here (e.g., show toast notification)
      throw error;
    }
  }, []);

  return {
    signInWithGoogle: handleGoogleLogin,
    signOut: handleSignOut,
  };
}


