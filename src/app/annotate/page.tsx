"use client";

import {
  TopNav,
  MemeImageViewer,
  AnnotationForm,
  AllCaughtUpCard,
} from "@/components/annotate";
import { useAnnotationPage } from "@/hooks/use-annotation-page";
import { constructMemeImageUrl } from "@/lib/annotate/utils/image-url";

/**
 * Annotate Page
 * Main page for annotating memes
 */
export default function AnnotatePage() {
  const {
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
    setDebugLog,
    queueLength,
  } = useAnnotationPage();

  // Construct image URL from meme storage path
  const imageUrl = meme?.storage_path
    ? constructMemeImageUrl(meme.storage_path)
    : null;

  return (
    <div className="fixed inset-0 flex flex-col bg-background min-h-screen overflow-y-auto lg:overflow-hidden">
      <TopNav />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
             {/* Simple Full Page Spinner */}
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
             <p className="text-muted-foreground animate-pulse">Fetching fresh memes...</p>
          </div>
        </div>
      ) : isAllCaughtUp ? (
        <div className="flex-1 overflow-y-auto">
          <AllCaughtUpCard />
        </div>
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row h-full lg:overflow-hidden">
          <MemeImageViewer
            imageUrl={imageUrl}
            loading={false} // We handle global loading above, so viewer is always "ready" if we get here
            debugLog={debugLog}
            onImageError={setDebugLog}
          />
          <AnnotationForm
            caption={caption}
            onCaptionChange={setCaption}
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            submitting={submitting}
            disabled={!meme || submitting} // Removed loading check as we don't render this if loading
            sessionCount={sessionCount}
            queueLength={queueLength}
            debugLog={debugLog}
          />
        </div>
      )}
    </div>
  );
}
