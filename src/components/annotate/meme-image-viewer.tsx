"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface MemeImageViewerProps {
  imageUrl: string | null;
  loading: boolean;
  debugLog?: string;
  onImageError?: (error: string) => void;
}

/**
 * Meme Image Viewer Component
 * Displays meme image in a dark container with loading and error states
 */
export function MemeImageViewer({
  imageUrl,
  loading,
  debugLog,
  onImageError,
}: MemeImageViewerProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setImageLoading(true);
      setImageError(false);
    } else {
      setImageLoading(false);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    if (imageUrl && onImageError) {
      console.error("Image load error:", imageUrl);
      onImageError(`Image failed to load: ${imageUrl}`);
    }
  };

  const showLoading = loading || (imageLoading && imageUrl && !imageError);

  return (
    <div className="flex w-full min-h-[50vh] lg:h-full lg:flex-1 bg-zinc-950 items-center justify-center p-8 relative overflow-hidden">
      {showLoading && (
        <div className="flex flex-col items-center justify-center gap-4 absolute inset-0 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading meme...</p>
        </div>
      )}
      
      {imageUrl && !imageError && (
        <img
          src={imageUrl}
          alt="Meme to annotate"
          className={`object-contain max-h-[80vh] w-auto transition-opacity duration-300 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {!imageUrl && !loading && (
        <div className="text-center text-muted-foreground">
          <p>No image available</p>
          {debugLog && (
            <p className="text-xs mt-2 text-red-500">{debugLog}</p>
          )}
        </div>
      )}

      {imageError && !loading && (
        <div className="text-center text-muted-foreground">
          <p>Failed to load image</p>
          {debugLog && (
            <p className="text-xs mt-2 text-red-500">{debugLog}</p>
          )}
        </div>
      )}
    </div>
  );
}










