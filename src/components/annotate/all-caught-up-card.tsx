"use client";

import { CheckCircle2 } from "lucide-react";

/**
 * All Caught Up Card Component
 * Displays message when user has annotated all available memes
 */
export function AllCaughtUpCard() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md w-full rounded-lg border bg-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">All memes have been annotated! 🎉</h2>
        <p className="text-muted-foreground mb-4">
          You've annotated all available memes. Great work!
        </p>
        <p className="text-sm text-muted-foreground">
          Check back later for more memes to annotate.
        </p>
      </div>
    </div>
  );
}















