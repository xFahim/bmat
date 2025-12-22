/**
 * Meme Fetch Handler
 * Handles meme fetching logic with state management
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchNextMemeRpc } from "../services/meme-rpc.service";
import type { Meme } from "../types";

export interface MemeFetchResult {
  meme: Meme | null;
  isAllCaughtUp: boolean;
  error: string | null;
}

/**
 * Fetches the next meme for a user
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns Meme fetch result with state flags
 */
export async function handleMemeFetch(
  supabase: SupabaseClient,
  userId: string
): Promise<MemeFetchResult> {
  try {
    const result = await fetchNextMemeRpc(supabase, userId);

    if (result.error) {
      return {
        meme: null,
        isAllCaughtUp: false,
        error: result.error,
      };
    }

    if (result.meme) {
      return {
        meme: result.meme,
        isAllCaughtUp: false,
        error: null,
      };
    }

    // No meme available - all caught up
    return {
      meme: null,
      isAllCaughtUp: true,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching meme:", error);
    return {
      meme: null,
      isAllCaughtUp: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

export interface MemeBatchFetchResult {
  memes: Meme[];
  error: string | null;
}

/**
 * Fetches a batch of memes for a user
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @param batchSize - Size of batch to fetch
 * @returns Batch fetch result
 */
export async function handleMemeBatchFetch(
  supabase: SupabaseClient,
  userId: string,
  batchSize: number = 5
): Promise<MemeBatchFetchResult> {
  try {
    const { fetchMemeBatchRpc } = await import("../services/meme-rpc.service");
    const result = await fetchMemeBatchRpc(supabase, userId, batchSize);

    return result;
  } catch (error) {
    console.error("Unexpected error in handleMemeBatchFetch:", error);
    return {
      memes: [],
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}















