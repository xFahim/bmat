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
  } = useAnnotationPage();

  // Construct image URL from meme storage path
  const imageUrl = meme?.storage_path
    ? constructMemeImageUrl(meme.storage_path)
    : null;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background min-h-screen">
      <TopNav />

      {isAllCaughtUp ? (
        <div className="flex-1 overflow-y-auto">
          <AllCaughtUpCard />
        </div>
      ) : (
        <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto">
          <MemeImageViewer
            imageUrl={imageUrl}
            loading={loading}
            debugLog={debugLog}
            onImageError={setDebugLog}
          />
          <AnnotationForm
            caption={caption}
            onCaptionChange={setCaption}
            onSubmit={handleSubmit}
            onSkip={handleSkip}
            submitting={submitting}
            disabled={!meme || loading}
            sessionCount={sessionCount}
            debugLog={debugLog}
          />
        </div>
      )}
    </div>
  );
}
