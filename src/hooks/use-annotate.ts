/**
 * Annotation hook
 * Provides annotation functionality for the annotate page
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  getNextMeme,
  submitAnnotation,
  constructMemeImageUrl,
  type Meme,
} from "@/lib/annotate";

interface UseAnnotateReturn {
  meme: Meme | null;
  loading: boolean;
  submitting: boolean;
  caption: string;
  imageUrl: string | undefined;
  isAllCaughtUp: boolean;
  setCaption: (caption: string) => void;
  handleSubmit: () => Promise<void>;
  fetchMeme: () => Promise<void>;
}

/**
 * Hook for annotation page functionality
 * @returns Object with annotation state and methods
 */
export function useAnnotate(): UseAnnotateReturn {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  // Get current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      console.log("[useAnnotate] Getting current user...");
      try {
        const supabase = createClient();
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();

        console.log("[useAnnotate] User fetch result:", {
          hasUser: !!currentUser,
          userId: currentUser?.id,
          error: error
            ? {
                message: error.message,
                code: error.code,
              }
            : null,
        });

        if (error) {
          console.error("[useAnnotate] Error getting user:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description:
              "Failed to get user information. Please refresh the page.",
          });
          return;
        }

        if (currentUser) {
          console.log(
            "[useAnnotate] User found, setting user state:",
            currentUser.id
          );
          setUser({ id: currentUser.id });
        } else {
          console.warn("[useAnnotate] No user found - user not authenticated");
        }
      } catch (error) {
        console.error("[useAnnotate] Unexpected error getting user:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      }
    };

    getCurrentUser();
  }, [toast]);

  // Fetch meme function
  const fetchMeme = useCallback(async () => {
    if (!user) {
      console.log("[useAnnotate] fetchMeme: No user, skipping fetch");
      return;
    }

    console.log("[useAnnotate] fetchMeme: Starting fetch for user:", user.id);
    setLoading(true);
    try {
      const supabase = createClient();
      const result = await getNextMeme(supabase, user.id);

      console.log("[useAnnotate] fetchMeme: Result from getNextMeme:", {
        success: result.success,
        hasMeme: !!result.meme,
        meme: result.meme,
        memeDetails: result.meme
          ? {
              id: result.meme.id,
              storage_path: result.meme.storage_path,
              annotation_count: result.meme.annotation_count,
              source_folder: result.meme.source_folder,
            }
          : null,
        error: result.error,
      });

      if (!result.success) {
        console.error(
          "[useAnnotate] fetchMeme: Failed to fetch meme:",
          result.error
        );
        toast({
          variant: "destructive",
          title: "Error",
          description:
            result.error || "Failed to fetch meme. Please try again.",
        });
        setMeme(null);
        setLoading(false);
        return;
      }

      if (result.meme) {
        console.log(
          "[useAnnotate] fetchMeme: Success, setting meme:",
          result.meme
        );
        console.log("[useAnnotate] fetchMeme: Meme details:", {
          id: result.meme.id,
          storage_path: result.meme.storage_path,
          storage_path_type: typeof result.meme.storage_path,
          annotation_count: result.meme.annotation_count,
          source_folder: result.meme.source_folder,
        });

        // Validate meme has required fields before setting
        if (!result.meme.storage_path) {
          console.error(
            "[useAnnotate] fetchMeme: ERROR - Meme missing storage_path!",
            result.meme
          );
        }

        setMeme(result.meme);

        // Verify state was set (will log in useEffect)
        setTimeout(() => {
          console.log("[useAnnotate] fetchMeme: State should be updated now");
        }, 100);
      } else {
        console.log(
          "[useAnnotate] fetchMeme: No meme returned (all caught up)"
        );
        setMeme(null);
      }
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
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
      setMeme(null);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch meme when user is available
  useEffect(() => {
    console.log("[useAnnotate] User effect triggered:", {
      hasUser: !!user,
      userId: user?.id,
    });
    if (user) {
      console.log("[useAnnotate] User available, calling fetchMeme");
      fetchMeme();
    } else {
      console.log("[useAnnotate] No user yet, waiting...");
    }
  }, [user, fetchMeme]);

  // Submit annotation function
  const handleSubmit = useCallback(async () => {
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a caption before submitting.",
      });
      return;
    }

    if (!meme || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing meme or user information.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const result = await submitAnnotation(
        supabase,
        meme.id,
        user.id,
        caption
      );

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            result.error || "Failed to save annotation. Please try again.",
        });
        return;
      }

      // Success
      toast({
        title: "Saved",
        description: "Your annotation has been saved successfully.",
      });

      // Clear caption and fetch next meme
      setCaption("");
      await fetchMeme();
    } catch (error) {
      console.error("Unexpected error submitting annotation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  }, [caption, meme, user, toast, fetchMeme]);

  // Construct image URL with error handling
  let imageUrl: string | undefined;
  try {
    if (meme) {
      if (!meme.storage_path) {
        console.error("[useAnnotate] Meme has no storage_path:", meme);
      } else {
        imageUrl = constructMemeImageUrl(meme.storage_path);
        console.log("[useAnnotate] Image URL constructed:", imageUrl);
      }
    } else {
      console.log("[useAnnotate] No meme, imageUrl will be undefined");
    }
  } catch (error) {
    console.error("[useAnnotate] Error constructing image URL:", error);
    imageUrl = undefined;
  }

  // Empty state - no memes left
  const isAllCaughtUp = !loading && !meme && !!user;

  // Debug: Log state changes
  useEffect(() => {
    console.log("[useAnnotate] State update:", {
      hasUser: !!user,
      userId: user?.id,
      hasMeme: !!meme,
      meme: meme,
      memeStoragePath: meme?.storage_path,
      memeStoragePathType: typeof meme?.storage_path,
      imageUrl: imageUrl,
      imageUrlType: typeof imageUrl,
      loading: loading,
      isAllCaughtUp: isAllCaughtUp,
    });
  }, [meme, imageUrl, loading, isAllCaughtUp, user]);

  return {
    meme,
    loading,
    submitting,
    caption,
    imageUrl,
    isAllCaughtUp,
    setCaption,
    handleSubmit,
    fetchMeme,
  };
}
