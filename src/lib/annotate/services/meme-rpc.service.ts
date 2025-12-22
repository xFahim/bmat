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

    // Empty array - no memes available
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















