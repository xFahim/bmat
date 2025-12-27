/**
 * Meme RPC Service
 * Direct RPC calls for fetching memes
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Meme } from "../types";

export interface MemeRpcResult {
  meme: Meme | null;
  error: string | null;
}

/**
 * Fetches the next meme using RPC function
 * Returns array response - extracts first item if available
 * @param supabase - Supabase client instance
 * @param userId - Authenticated user ID
 * @returns Meme or null with error message if any
 */
export async function fetchNextMemeRpc(
  supabase: SupabaseClient,
  userId: string
): Promise<MemeRpcResult> {
  try {
    const { data, error } = await supabase.rpc("get_next_meme", {
      user_uuid: userId,
    });

    // CRITICAL: Log the raw RPC response for debugging
    console.log("RPC Response:", data);

    if (error) {
      console.error("RPC Error:", error);
      return {
        meme: null,
        error: error.message || "Failed to fetch meme",
      };
    }

    // CRITICAL: Handle array response correctly
    if (data && data.length > 0) {
      const memeData = data[0];
      return {
        meme: {
          id: memeData.id,
          storage_path: memeData.storage_path,
          annotation_count: memeData.annotation_count || 0,
          source_folder: memeData.source_folder || "",
        },
        error: null,
      };
    }

    return {
      meme: null,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching meme:", error);
    return {
      meme: null,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Result of fetching a batch of memes
 */
export interface MemeBatchRpcResult {
  memes: Meme[];
  error: string | null;
}

/**
 * Fetches a batch of memes using RPC function
 * @param supabase - Supabase client instance
 * @param userId - Authenticated user ID
 * @param batchSize - Number of memes to fetch (default 5)
 * @returns Array of memes or empty array with error message if any
 */
export async function fetchMemeBatchRpc(
  supabase: SupabaseClient,
  userId: string,
  batchSize: number = 5
): Promise<MemeBatchRpcResult> {
  try {
    // Calling the new batch RPC
    // Assumption: The RPC is named 'get_meme_batch' and accepts user_uuid and batch_size
    const { data, error } = await supabase.rpc("get_meme_batch", {
      user_uuid: userId,
      batch_size: batchSize,
    });

    if (error) {
      console.error("Batch RPC Error:", error);
      return {
        memes: [],
        error: error.message || "Failed to fetch meme batch",
      };
    }

    if (data && Array.isArray(data)) {
      const memes: Meme[] = data.map((item: any) => ({
        id: item.id,
        storage_path: item.storage_path,
        annotation_count: item.annotation_count || 0,
        source_folder: item.source_folder || "",
      }));

      return {
        memes,
        error: null,
      };
    }

    return {
      memes: [],
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching meme batch:", error);
    return {
      memes: [],
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
}

/**
 * Releases the lock on a meme via RPC
 * @param supabase - Supabase client
 * @param memeId - ID of meme to unlock
 */
export async function releaseMemeLockRpc(
  supabase: SupabaseClient,
  memeId: number
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc("release_meme_lock", {
      meme_id_param: memeId,
    });

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    console.error("Unexpected error in releaseMemeLockRpc:", err);
    return { error: "Unexpected error" };
  }
}

















