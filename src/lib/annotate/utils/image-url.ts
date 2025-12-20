/**
 * Image URL utilities
 * Utilities for constructing meme image URLs
 */

/**
 * Storage bucket name for memes
 */
export const MEME_BUCKET_NAME = "memeBucket1";

/**
 * Constructs the public URL for a meme image
 * @param storagePath - Storage path of the meme
 * @returns Public URL for the meme image
 */
export function constructMemeImageUrl(storagePath: string): string {
  console.log("[constructMemeImageUrl] Input:", {
    storagePath,
    storagePathType: typeof storagePath,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    console.error(
      "[constructMemeImageUrl] NEXT_PUBLIC_SUPABASE_URL is not defined"
    );
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  // Sanitize storage path to prevent path traversal
  const sanitizedPath = storagePath.replace(/\.\./g, "").replace(/^\//, "");

  const imageUrl = `${supabaseUrl}/storage/v1/object/public/${MEME_BUCKET_NAME}/${sanitizedPath}`;

  console.log("[constructMemeImageUrl] Output:", {
    sanitizedPath,
    supabaseUrl,
    bucketName: MEME_BUCKET_NAME,
    finalUrl: imageUrl,
  });

  return imageUrl;
}

/**
 * Validates that a storage path is safe
 * @param storagePath - Storage path to validate
 * @returns true if path is safe, false otherwise
 */
export function isValidStoragePath(storagePath: string): boolean {
  if (!storagePath || typeof storagePath !== "string") {
    return false;
  }

  // Prevent path traversal attacks
  if (storagePath.includes("..") || storagePath.includes("//")) {
    return false;
  }

  return true;
}
