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
  queueLength: number;
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
    
    // ZOMBIE PREVENTION: Clear queue immediately to ensure we don't show stale data
    setMemeQueue([]); 
    
    try {
      // Initial fetch with batch size 5
      const result = await fetchMemeBatchHelper(user.id, 5);
      
      if (result.error) {
        setError(result.error);
        // Queue already cleared
      } else if (result.memes.length === 0) {
        setIsAllCaughtUp(true);
        // Queue already cleared
      } else {
        // Enforce freshness: STRICTLY ignore any meme with annotation_count > 0
        // Also ensure we don't accidentally add duplicates if we aren't clearing queue (though here we setMemeQueue)
        const freshMemes = result.memes.filter(m => m.annotation_count === 0);
        
        if (freshMemes.length === 0 && result.memes.length > 0) {
            // We got memes but they were all annotated already
            setIsAllCaughtUp(true);
            // Queue already cleared
        } else {
            setMemeQueue(freshMemes);
            setIsAllCaughtUp(false);
            preloadImages(freshMemes);
        }
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
      // Remove the first item
      const newQueue = prev.slice(1);
      
      // Calculate if we need more
      const shouldFetch = newQueue.length < 3 && !isFetchingBackground.current;

      if (shouldFetch) {
        isFetchingBackground.current = true;
        // Trigger background fetch
        fetchMemeBatchHelper(user.id, 5).then((result) => {
           if (result.memes && result.memes.length > 0) {
             setMemeQueue((currentQueue) => {
               // STRICT DUPLICATE CHECK
               // 1. Get Set of all IDs currently in queue
               const currentIds = new Set(currentQueue.map(m => m.id));
               
               // 2. Filter incoming batch:
               //    - Must NOT be in current queue
               //    - Must have annotation_count === 0
               const uniqueFreshMemes = result.memes.filter(m => 
                 !currentIds.has(m.id) && m.annotation_count === 0
               );
               
               if (uniqueFreshMemes.length > 0) {
                 preloadImages(uniqueFreshMemes);
                 return [...currentQueue, ...uniqueFreshMemes];
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
      
      return newQueue;
    });

  }, [user, fetchMemeBatchHelper, preloadImages]);

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
        queueLength: memeQueue.length,
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
