"use client";

import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Loader2, ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already loaded from cache
  // Use useLayoutEffect to prevent flash of content
  useLayoutEffect(() => {
    if (!imageUrl) {
        setImageLoading(false);
        return;
    }
    
    // If we have a ref and it is complete, we are loaded.
    if (imgRef.current?.complete) {
      setImageLoading(false);
      setImageError(false);
      setIsZoomed(false);
      return;
    }

    // Otherwise, set loading
    setImageLoading(true);
    setImageError(false);
    setIsZoomed(false);
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
    <>
      <div className="flex w-full min-h-[50vh] lg:h-full lg:flex-1 bg-zinc-950 items-center justify-center p-8 relative overflow-hidden">
        {showLoading && (
          <div className="flex flex-col items-center justify-center gap-4 absolute inset-0 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading meme...</p>
          </div>
        )}
        
        {imageUrl && !imageError && (
          <div 
            className="relative cursor-zoom-in group max-h-[80vh] w-auto"
            onClick={() => setIsZoomed(true)}
          >
             <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg">
                <div className="flex items-center gap-2 rounded-full bg-zinc-900/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-zinc-700">
                  <ZoomIn className="h-4 w-4" />
                  Click to Zoom
                </div>
              </div>
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Meme to annotate"
              className={`object-contain max-h-[80vh] w-auto transition-opacity duration-300 rounded-md ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
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

       {/* ZOOM MODAL */}
       <AnimatePresence>
        {isZoomed && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-full w-full max-w-7xl overflow-hidden rounded-lg flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute right-4 top-4 z-50 rounded-full bg-zinc-900/50 p-2 text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close zoom modal"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={imageUrl}
                alt="Meme full size"
                className="object-contain max-h-full max-w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}










