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
  const [meme, setMeme] = useState<Meme | null>(null);
  const [nextMeme, setNextMeme] = useState<Meme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllCaughtUp, setIsAllCaughtUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  // Helper to preload image
  const preloadImage = useCallback((memeData: Meme) => {
    if (memeData.storage_path) {
      const url = constructMemeImageUrl(memeData.storage_path);
      const img = new Image();
      img.src = url;
    }
  }, []);

  // Helper to fetch
  const fetchMemeHelper = useCallback(async (userId: string): Promise<{ meme: Meme | null, isAllCaughtUp: boolean, error: string | null }> => {
    const supabase = createClient();
    return await handleMemeFetch(supabase, userId);
  }, []);

  // Let's rely on the `user` state dependency in useCallback
  const prefetchNextImpl = useCallback(async () => {
      if (!user) return;
      try {
        const result = await fetchMemeHelper(user.id);
        if (result.meme) {
           setNextMeme(result.meme);
           preloadImage(result.meme);
        }
      } catch (e) {
        console.error("Error prefetching next meme", e);
      }
  }, [user, fetchMemeHelper, preloadImage]);

  const refreshMeme = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    setIsAllCaughtUp(false);
    
    try {
      const result = await fetchMemeHelper(user.id);
      
      if (result.error) {
        setError(result.error);
        setMeme(null);
      } else if (result.isAllCaughtUp) {
        setIsAllCaughtUp(true);
        setMeme(null);
      } else {
        setMeme(result.meme);
        setIsAllCaughtUp(false);
        // Trigger background prefetch
        const nextResult = await fetchMemeHelper(user.id);
        if (nextResult.meme) {
            setNextMeme(nextResult.meme);
            preloadImage(nextResult.meme);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to refresh meme");
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchMemeHelper, preloadImage]);

  const consumeNextMeme = useCallback(async () => {
    if (!user) return;
    
    if (nextMeme) {
       setMeme(nextMeme);
       setNextMeme(null);
       
       // Fetch new next
       const result = await fetchMemeHelper(user.id);
       if (result.meme) {
           setNextMeme(result.meme);
           preloadImage(result.meme);
       }
    } else {
       await refreshMeme();
    }
  }, [user, nextMeme, refreshMeme, fetchMemeHelper, preloadImage]);

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
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  // Initial fetch
  useEffect(() => {
    // If we have user, but no meme, and not caught up -> fetch
    // Also if we are NOT loading (meaning session check is done).
    // `isLoading` starts true.
    // If we have user, but no meme, and not caught up -> fetch
    // Also guard against existing errors to prevent infinite loops
    // and don't fetch if already loading (though refreshMeme handles that, better to avoid call)
    if (user && !meme && !isAllCaughtUp && !error && !isLoading) {
       refreshMeme();
    }
  }, [user, meme, isAllCaughtUp, error, isLoading, refreshMeme]);

  return (
    <MemeContext.Provider
      value={{
        meme,
        nextMeme,
        isLoading,
        isAllCaughtUp,
        error,
        refreshMeme,
        consumeNextMeme,
        user,
        sessionCount,
        incrementSessionCount,
        prefetchNext: prefetchNextImpl
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
