/**
 * Annotation Page Hook
 * Orchestrates state and logic for the annotation page
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { initializeUserSession } from "@/lib/annotate/services/user-session.service";
import { handleMemeFetch } from "@/lib/annotate/handlers/meme-fetch.handler";
import { submitAnnotation } from "@/lib/annotate/services/annotation.service";
import { validateCaptionInput, validateSubmissionData } from "@/lib/annotate/utils/validation.helpers";
import {
  createAuthErrorToast,
  createValidationErrorToast,
  createErrorToast,
  createSuccessToast,
} from "@/lib/annotate/utils/toast.helpers";
import type { Meme } from "@/lib/annotate/types";

export interface UseAnnotationPageReturn {
  meme: Meme | null;
  loading: boolean;
  submitting: boolean;
  caption: string;
  isAllCaughtUp: boolean;
  debugLog: string;
  sessionCount: number;
  setCaption: (caption: string) => void;
  handleSubmit: () => Promise<void>;
  handleSkip: () => Promise<void>;
  fetchNextMeme: () => Promise<void>;
  setDebugLog: (message: string) => void;
}

/**
 * Hook for annotation page functionality
 * @returns Object with annotation state and methods
 */
export function useAnnotationPage(): UseAnnotationPageReturn {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState("");
  const [isAllCaughtUp, setIsAllCaughtUp] = useState(false);
  const [debugLog, setDebugLog] = useState<string>("");
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  // Initialize user session on mount
  useEffect(() => {
    const initialize = async () => {
      const supabase = createClient();
      const result = await initializeUserSession(supabase);

      if (result.error) {
        toast(createAuthErrorToast());
        return;
      }

      if (result.user) {
        setUser(result.user);
        setSessionCount(result.sessionCount);
      }
    };

    initialize();
  }, [toast]);

  // Fetch next meme function
  const fetchNextMeme = useCallback(async () => {
    if (!user) {
      console.log("No user available, skipping fetch");
      return;
    }

    setLoading(true);
    setIsAllCaughtUp(false);
    setDebugLog("");

    try {
      const supabase = createClient();
      const result = await handleMemeFetch(supabase, user.id);

      if (result.error) {
        setDebugLog(`Error: ${result.error}`);
        toast(createErrorToast(result.error || "Failed to fetch meme. Please try again."));
        setMeme(null);
        return;
      }

      setMeme(result.meme);
      setIsAllCaughtUp(result.isAllCaughtUp);
    } catch (error) {
      console.error("Unexpected error fetching meme:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setDebugLog(`Unexpected error: ${errorMessage}`);
      toast(createErrorToast(errorMessage));
      setMeme(null);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch meme when user is available
  useEffect(() => {
    if (user) {
      fetchNextMeme();
    }
  }, [user, fetchNextMeme]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    // Validate caption
    const captionError = validateCaptionInput(caption);
    if (captionError) {
      toast(createValidationErrorToast(captionError));
      return;
    }

    // Validate submission data
    const dataError = validateSubmissionData(meme, user?.id || null);
    if (dataError) {
      toast(createErrorToast(dataError));
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const result = await submitAnnotation(
        supabase,
        meme!.id,
        user!.id,
        caption
      );

      if (!result.success) {
        toast(createErrorToast(result.error || "Failed to save annotation. Please try again."));
        return;
      }

      // Success
      toast(createSuccessToast());
      setCaption("");
      setSessionCount((prev) => prev + 1);
      await fetchNextMeme();
    } catch (error) {
      console.error("Unexpected error submitting annotation:", error);
      toast(createErrorToast("An unexpected error occurred."));
    } finally {
      setSubmitting(false);
    }
  }, [caption, meme, user, toast, fetchNextMeme]);

  // Handle skip
  const handleSkip = useCallback(async () => {
    if (!meme || !user) {
      return;
    }
    setCaption("");
    await fetchNextMeme();
  }, [meme, user, fetchNextMeme]);

  return {
    meme,
    loading,
    submitting,
    caption,
    isAllCaughtUp,
    debugLog,
    sessionCount,
    setCaption,
    handleSubmit,
    handleSkip,
    fetchNextMeme,
    setDebugLog,
  };
}
