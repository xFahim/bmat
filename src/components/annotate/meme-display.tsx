"use client";

import { useState, useEffect } from "react";

interface MemeDisplayProps {
  imageUrl?: string;
  loading?: boolean;
}

export function MemeDisplay({
  imageUrl,
  loading: externalLoading = false,
}: MemeDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Debug: Log props and state changes
  useEffect(() => {
    console.log("[MemeDisplay] Props/State update:", {
      imageUrl,
      externalLoading,
      isLoading,
      hasError,
    });
  }, [imageUrl, externalLoading, isLoading, hasError]);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      console.log(
        "[MemeDisplay] Image URL changed, resetting loading state:",
        imageUrl
      );
      setIsLoading(true);
      setHasError(false);
    } else {
      console.log("[MemeDisplay] No image URL provided");
    }
  }, [imageUrl]);

  const showLoading = externalLoading || (isLoading && imageUrl && !hasError);

  console.log("[MemeDisplay] Render state:", {
    showLoading,
    hasError,
    hasImageUrl: !!imageUrl,
    shouldShowImage: imageUrl && !hasError && !showLoading,
    shouldShowNoImage: !imageUrl && !externalLoading && !showLoading,
  });

  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 border border-border">
      {showLoading && (
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          <p className="text-sm text-muted-foreground">Loading meme...</p>
        </div>
      )}

      {hasError && !showLoading && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Failed to load image</p>
        </div>
      )}

      {imageUrl && !hasError && !showLoading && (
        <img
          src={imageUrl}
          alt="Meme to annotate"
          className="max-h-full max-w-full object-contain"
          onLoad={() => {
            console.log("[MemeDisplay] Image loaded successfully:", imageUrl);
            setIsLoading(false);
          }}
          onError={(e) => {
            console.error("[MemeDisplay] Image failed to load:", {
              imageUrl,
              error: e,
              target: e.currentTarget,
            });
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}

      {!imageUrl && !externalLoading && !showLoading && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">No image selected</p>
        </div>
      )}
    </div>
  );
}
