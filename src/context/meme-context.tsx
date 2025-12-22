"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Meme } from "@/lib/annotate/types";
import { createClient } from "@/utils/supabase/client";
import { initializeUserSession } from "@/lib/annotate/services/user-session.service";
import { handleMemeFetch } from "@/lib/annotate/handlers/meme-fetch.handler";
import { constructMemeImageUrl } from "@/lib/annotate/utils/image-url";

interface MemeContextType {
  meme: Meme | null;
  nextMeme: Meme | null;
  isLoading: boolean;
  isAllCaughtUp: boolean;
  error: string | null;
  refreshMeme: () => Promise<void>;
  consumeNextMeme: () => Promise<void>;
  user: { id: string } | null;
  sessionCount: number;
  incrementSessionCount: () => void;
  prefetchNext: () => void; 
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export function MemeProvider({ children }: { children: React.ReactNode }) {
  const [memeQueue, setMemeQueue] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllCaughtUp, setIsAllCaughtUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  // Helper to preload images
  const preloadImages = useCallback((memes: Meme[]) => {
    memes.forEach((memeData) => {
      if (memeData.storage_path) {
        const url = constructMemeImageUrl(memeData.storage_path);
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  // Helper to fetch batch
  const fetchMemeBatchHelper = useCallback(async (userId: string, batchSize: number = 5) => {
    const supabase = createClient();
    // Dynamically import to avoid circular dependency issues if any, though likely not needed here
    const { handleMemeBatchFetch } = await import("@/lib/annotate/handlers/meme-fetch.handler");
    return await handleMemeBatchFetch(supabase, userId, batchSize);
  }, []);

  const refreshMeme = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setIsAllCaughtUp(false);
    
    try {
      // Initial fetch with batch size 5
      const result = await fetchMemeBatchHelper(user.id, 5);
      
      if (result.error) {
        setError(result.error);
        setMemeQueue([]);
      } else if (result.memes.length === 0) {
        setIsAllCaughtUp(true);
        setMemeQueue([]);
      } else {
        setMemeQueue(result.memes);
        setIsAllCaughtUp(false);
        preloadImages(result.memes);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to refresh memes");
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchMemeBatchHelper, preloadImages]);

  // Ref to track if a background fetch is in progress to prevent duplicates
  const isFetchingBackground = React.useRef(false);

  const consumeNextMeme = useCallback(async () => {
    if (!user) return;
    
    // 1. Optimistic update: Remove current meme instantly
    setMemeQueue((prev) => {
      const newQueue = prev.slice(1);
      
      // 2. Background fetch if queue is running low AND we are not already fetching
      if (newQueue.length < 3 && !isFetchingBackground.current) {
        isFetchingBackground.current = true;
        // Trigger background fetch, don't await it here to keep UI responsive
        fetchMemeBatchHelper(user.id, 5).then((result) => {
           if (result.memes && result.memes.length > 0) {
             setMemeQueue((currentQueue) => {
               // Filter duplicates
               const existingIds = new Set(currentQueue.map(m => m.id));
               const uniqueNewMemes = result.memes.filter(m => !existingIds.has(m.id));
               
               if (uniqueNewMemes.length > 0) {
                 // Preload newly added images
                 preloadImages(uniqueNewMemes);
                 return [...currentQueue, ...uniqueNewMemes];
               }
               return currentQueue;
             });
           }
        }).catch(err => {
            console.error("Background fetch failed", err);
        }).finally(() => {
            isFetchingBackground.current = false;
        });
      }

      // Check if we ran out completely even after slice
      if (newQueue.length === 0) {
         // If queue is empty, we attempt to refresh immediately to show loader
         // But since we just sliced, we might want to trigger a refresh logic
         // For now, let's just let the effect handle the empty state or user sees loader
         refreshMeme(); 
      }
      
      return newQueue;
    });

  }, [user, fetchMemeBatchHelper, preloadImages, refreshMeme]);

  const incrementSessionCount = useCallback(() => {
    setSessionCount(prev => prev + 1);
  }, []);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        const supabase = createClient();
        const result = await initializeUserSession(supabase);
        if (result.user) {
          setUser(result.user);
          setSessionCount(result.sessionCount);
        }
      } catch (err) {
        console.error("Failed to initialize session:", err);
      } finally {
        // Don't set loading false here because we want to wait for initial meme fetch
        // dependent on user being set
      }
    };
    initSession();
  }, []);

  // Initial fetch
  useEffect(() => {
    // If we have user, but queue is empty, and not caught up -> fetch
    if (user && memeQueue.length === 0 && !isAllCaughtUp && !error) {
       refreshMeme();
    }
  }, [user, memeQueue.length, isAllCaughtUp, error, refreshMeme]);

  // Derived state for consumers
  const currentMeme = memeQueue.length > 0 ? memeQueue[0] : null;
  const nextMeme = memeQueue.length > 1 ? memeQueue[1] : null;

  // Loading state Logic:
  // If we have items in queue, we are NOT loading from user perspective
  // Only load if queue is empty and we are fetching
  const effectiveLoading = isLoading && memeQueue.length === 0;

  return (
    <MemeContext.Provider
      value={{
        meme: currentMeme,
        nextMeme: nextMeme,
        isLoading: effectiveLoading,
        isAllCaughtUp,
        error,
        refreshMeme,
        consumeNextMeme,
        user,
        sessionCount,
        incrementSessionCount,
        prefetchNext: () => {}, // No-op now as it's handled automatically
      }}
    >
      {children}
    </MemeContext.Provider>
  );
}

export function useMemeContext() {
  const context = useContext(MemeContext);
  if (context === undefined) {
    throw new Error("useMemeContext must be used within a MemeProvider");
  }
  return context;
}
