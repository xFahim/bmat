/**
 * Annotation Page Hook
 * Orchestrates state and logic for the annotation page
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { submitAnnotation, releaseMemeReservation } from "@/lib/annotate/services/annotation.service";
import { validateCaptionInput, validateSubmissionData } from "@/lib/annotate/utils/validation.helpers";
import {
  createValidationErrorToast,
  createErrorToast,
  createSuccessToast,
} from "@/lib/annotate/utils/toast.helpers";
import type { Meme } from "@/lib/annotate/types";
import { useMemeContext } from "@/context/meme-context";

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
  queueLength: number;
}

/**
 * Hook for annotation page functionality
 * @returns Object with annotation state and methods
 */
export function useAnnotationPage(): UseAnnotationPageReturn {
  const { 
    meme, 
    isLoading: loading, 
    isAllCaughtUp, 
    refreshMeme, 
    consumeNextMeme, 
    user, 
    sessionCount, 
    incrementSessionCount,
    error: contextError,
    queueLength
  } = useMemeContext();
  
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState("");
  const [debugLog, setDebugLog] = useState<string>("");
  const { toast } = useToast();
  // We need router for redirects - use require to avoid conditional hook issues if any, but standard import is better usually.
  // Keeping original pattern.
  const { replace } = require("next/navigation").useRouter();

  // Sync context error to debugLog and handle redirects
  useEffect(() => {
    if (contextError) {
      setDebugLog(contextError);
      
      // Auto-redirect on auth errors
      if (
        contextError.toLowerCase().includes("unauthorized") ||
        contextError.toLowerCase().includes("jwt") || 
        contextError.toLowerCase().includes("session")
      ) {
         toast(createErrorToast("Session expired. Please login again."));
         replace("/login");
      }
    }
  }, [contextError, replace, toast]);

  // Fetch next meme function (manual refresh)
  const fetchNextMeme = useCallback(async () => {
    await refreshMeme();
  }, [refreshMeme]);

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
        // CHECK FOR DUPLICATE ERROR
        // The RPC returns a specific message if the meme is already annotated
        if (result.error && result.error.includes("already been annotated")) {
          // Special handling for duplicates:
          // 1. Show friendly toast
          toast({
            title: "Too late!",
            description: `Someone else just finished this meme (ID: ${meme?.id})! Moving you to the next one.`,
            variant: "destructive", // or default, but destructive grabs attention
          });

          // 2. Refresh meme batch entirely to clear potential local zombies
          setCaption("");
          incrementSessionCount();
          // Force a full refresh instead of just consuming next, 
          // because if we hit a duplicate, our entire local batch might be stale.
          await fetchNextMeme(); 
          return;
        }

        // Generic error
        toast(createErrorToast("Failed to save annotation. Please try again."));
        return;
      }

      // Success
      toast(createSuccessToast());
      setCaption("");
      incrementSessionCount();
      await consumeNextMeme();
    } catch (error) {
      console.error("Unexpected error submitting annotation:", error);
      toast(createErrorToast("An unexpected error occurred."));
    } finally {
      setSubmitting(false);
    }
  }, [caption, meme, user, toast, consumeNextMeme, incrementSessionCount]);

  // Handle skip
  const handleSkip = useCallback(async () => {
    if (!meme || !user) {
      return;
    }
    
    // Release reservation in background - don't block UI
    const supabase = createClient();
    releaseMemeReservation(supabase, meme.id).catch(err => 
      console.error("Failed to release skipped meme:", err)
    );

    setCaption("");
    await consumeNextMeme();
  }, [meme, user, consumeNextMeme]);

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
    queueLength,
  };
}
