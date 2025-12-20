/**
 * Meme service
 * Handles meme fetching operations with security checks
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Meme, FetchMemeResult } from "../types";

/**
 * Fetches the next meme for a user using the RPC function
 * @param supabase - Supabase client instance
 * @param userId - Authenticated user ID
 * @returns Result containing meme or error
 */
export async function getNextMeme(
  supabase: SupabaseClient,
  userId: string
): Promise<FetchMemeResult> {
  try {
    // Security: Validate user ID
    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
      return {
        success: false,
        meme: null,
        error: "Invalid user ID",
      };
    }

    // Call RPC function to get next meme
    const { data, error } = await supabase.rpc("get_next_meme", {
      user_uuid: userId.trim(),
    });

    if (error) {
      // Log detailed error information for debugging
      // Extract properties safely to avoid serialization issues
      const errorInfo = {
        message: error.message || "No message",
        code: error.code || "No code",
        details: error.details || "No details",
        hint: error.hint || "No hint",
      };
      console.error("Error fetching meme:", errorInfo);
      // Also log the raw error for additional context
      console.error("Raw error object:", error);
      return {
        success: false,
        meme: null,
        error: error.message || error.code || "Failed to fetch meme",
      };
    }

    // If no data, user has annotated all memes
    if (!data) {
      console.log(
        "[getNextMeme] No data returned from RPC - user has annotated all memes"
      );
      return {
        success: true,
        meme: null,
      };
    }

    // Handle array response (RPC might return array)
    let rawMeme;
    if (Array.isArray(data)) {
      // Log array response details
      console.log("[getNextMeme] Received array response from RPC:", {
        isArray: true,
        arrayLength: data.length,
        arrayContent: data,
        stringified: JSON.stringify(data, null, 2),
      });

      if (data.length === 0) {
        console.log("[getNextMeme] Array is empty - no memes available");
        return {
          success: true,
          meme: null,
        };
      }

      // Extract first item from array
      rawMeme = data[0];
      console.log("[getNextMeme] Extracted first item from array:", {
        extractedMeme: rawMeme,
        memeId: rawMeme?.id,
        storagePath: rawMeme?.storage_path,
        sourceFolder: rawMeme?.source_folder,
        annotationCount: rawMeme?.annotation_count,
      });
    } else {
      // Log non-array response
      console.log("[getNextMeme] Received non-array response from RPC:", {
        isArray: false,
        dataType: typeof data,
        data: data,
        stringified: JSON.stringify(data, null, 2),
      });
      rawMeme = data;
    }

    console.log("[getNextMeme] Processed meme data:", {
      rawMeme,
      rawMemeType: typeof rawMeme,
      rawMemeKeys:
        rawMeme && typeof rawMeme === "object" ? Object.keys(rawMeme) : "N/A",
      rawMemeStringified: JSON.stringify(rawMeme, null, 2),
    });

    // Validate meme data structure
    const validationResult = validateMemeWithDetails(rawMeme);
    if (!validationResult.isValid) {
      console.error("[getNextMeme] Validation failed:", {
        receivedData: rawMeme,
        validationDetails: validationResult.details,
        expectedStructure: {
          id: "number",
          storage_path: "string (non-empty)",
          annotation_count: "number",
          source_folder: "string",
        },
      });
      return {
        success: false,
        meme: null,
        error: `Invalid meme data received: ${validationResult.details.join(
          ", "
        )}`,
      };
    }

    // Extract only the fields we need (ignore extra fields like file_name, is_active, created_at)
    const meme: Meme = {
      id: rawMeme.id,
      storage_path: rawMeme.storage_path,
      annotation_count: rawMeme.annotation_count,
      source_folder: rawMeme.source_folder,
    };

    console.log("[getNextMeme] Validation passed, processed meme:", meme);
    console.log("[getNextMeme] Returning success with meme:", {
      meme,
      memeType: typeof meme,
      memeKeys: Object.keys(meme),
    });

    return {
      success: true,
      meme,
    };
  } catch (error) {
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error("Unexpected error fetching meme:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    } else {
      console.error("Unexpected error fetching meme (non-Error):", {
        error: String(error),
        type: typeof error,
        value: error,
      });
    }
    // Also log the raw error for additional context
    console.error("Raw error:", error);
    return {
      success: false,
      meme: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Validates meme data structure with detailed error reporting
 * @param meme - Meme object to validate
 * @returns Validation result with details
 */
function validateMemeWithDetails(meme: unknown): {
  isValid: boolean;
  details: string[];
} {
  const details: string[] = [];

  if (!meme) {
    details.push("meme is null or undefined");
    return { isValid: false, details };
  }

  if (typeof meme !== "object") {
    details.push(`meme is not an object (type: ${typeof meme})`);
    return { isValid: false, details };
  }

  const m = meme as Record<string, unknown>;

  // Check id
  if (typeof m.id !== "number") {
    details.push(`id is not a number (type: ${typeof m.id}, value: ${m.id})`);
  }

  // Check storage_path
  if (typeof m.storage_path !== "string") {
    details.push(
      `storage_path is not a string (type: ${typeof m.storage_path}, value: ${
        m.storage_path
      })`
    );
  } else if (m.storage_path.length === 0) {
    details.push("storage_path is an empty string");
  }

  // Check annotation_count
  if (typeof m.annotation_count !== "number") {
    details.push(
      `annotation_count is not a number (type: ${typeof m.annotation_count}, value: ${
        m.annotation_count
      })`
    );
  }

  // Check source_folder
  if (typeof m.source_folder !== "string") {
    details.push(
      `source_folder is not a string (type: ${typeof m.source_folder}, value: ${
        m.source_folder
      })`
    );
  }

  // Log all available keys for debugging
  const availableKeys = Object.keys(m);
  console.log(
    "[validateMemeWithDetails] Available keys in data:",
    availableKeys
  );
  console.log("[validateMemeWithDetails] Full object structure:", m);

  return {
    isValid: details.length === 0,
    details: details.length > 0 ? details : ["All validations passed"],
  };
}

/**
 * Validates meme data structure (legacy function for backward compatibility)
 * @param meme - Meme object to validate
 * @returns true if meme is valid, false otherwise
 */
function isValidMeme(meme: unknown): meme is Meme {
  const result = validateMemeWithDetails(meme);
  return result.isValid;
}
