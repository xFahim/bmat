/**
 * Profile service
 * Handles user profile operations in the database
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfileData } from '../types';

/**
 * Checks if a user profile exists in the database
 * @param supabase - Supabase client instance
 * @param userId - User ID to check
 * @returns true if profile exists, false otherwise
 */
export async function profileExists(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    // PGRST116 is the error code for "no rows returned"
    if (error && error.code === 'PGRST116') {
      return false;
    }

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    throw error;
  }
}

/**
 * Creates a new user profile in the database
 * @param supabase - Supabase client instance
 * @param profileData - Profile data to insert
 * @returns The created profile data
 */
export async function createProfile(
  supabase: SupabaseClient,
  profileData: UserProfileData
): Promise<void> {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
      });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

/**
 * Ensures a user profile exists, creating it if necessary
 * @param supabase - Supabase client instance
 * @param profileData - Profile data
 * @returns true if profile was created, false if it already existed
 */
export async function ensureProfileExists(
  supabase: SupabaseClient,
  profileData: UserProfileData
): Promise<boolean> {
  const exists = await profileExists(supabase, profileData.id);

  if (!exists) {
    await createProfile(supabase, profileData);
    return true;
  }

  return false;
}
















