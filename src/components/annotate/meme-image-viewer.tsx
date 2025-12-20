"use client";

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
  const handleImageError = () => {
    if (imageUrl && onImageError) {
      console.error("Image load error:", imageUrl);
      onImageError(`Image failed to load: ${imageUrl}`);
    }
  };

  return (
    <div className="flex h-full lg:w-[65%] bg-zinc-950 items-center justify-center p-8">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading meme...</p>
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Meme to annotate"
          className="object-contain max-h-[80vh] w-auto"
          onError={handleImageError}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          <p>No image available</p>
          {debugLog && (
            <p className="text-xs mt-2 text-red-500">{debugLog}</p>
          )}
        </div>
      )}
    </div>
  );
}








