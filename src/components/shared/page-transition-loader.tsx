"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Page Transition Loader Component
 * Shows a minimal loading indicator during page transitions
 */
export function PageTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show loader if pathname actually changed
    if (pathname !== prevPathnameRef.current) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show loader immediately
      setIsLoading(true);
      setIsVisible(true);
      prevPathnameRef.current = pathname;

      // Hide loader after page has had time to render
      // Use a delay that allows for smooth transition
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        // Wait for fade-out animation before removing from DOM
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }, 250);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

