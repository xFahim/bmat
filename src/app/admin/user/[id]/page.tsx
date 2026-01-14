"use client";

import { useParams, useRouter } from "next/navigation";
import { TopNav } from "@/components/annotate/top-nav";
import { UserHeader, BulkActionBar, ImageDialog } from "@/components/admin";
import { useUserReview } from "@/hooks/use-user-review";
import {
  SelectAllCheckbox,
  AnnotationsGrid,
  EmptyState,
  LoadingState,
  ReviewDetailPanel,
} from "./components";

export default function UserReviewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const {
    annotations,
    user,
    selectedItems,
    loading,
    isBanning,
    isBulkActionLoading,
    imageDialogOpen,
    selectedImage,
    pendingCount,
    pendingAnnotations,
    allSelected,
    someSelected,
    handleSelectItem,
    handleSelectAll,
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,
    handleImageClick,
    handleBan,
    setImageDialogOpen,
    focusedAnnotation,
    setFocusedAnnotationId,
  } = useUserReview(userId);

  const handleBack = () => {
    router.push("/admin");
  };

  const handleBanWithRedirect = async () => {
    const success = await handleBan();
    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <TopNav />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Left Panel - List */}
        <div 
            className={`flex flex-col border-r border-border bg-muted/5 transition-all
            ${focusedAnnotation ? 'hidden md:flex w-full md:w-[60%]' : 'w-full md:w-[60%]'}
            `}
        >
          <div className="p-6 border-b border-border bg-background z-10">
              <UserHeader
                user={user}
                pendingCount={pendingCount}
                onBack={handleBack}
                onBan={handleBanWithRedirect}
                isBanning={isBanning}
              />
              
              {!loading && (
                 <div className="mt-4">
                    <SelectAllCheckbox
                      checked={allSelected || someSelected}
                      pendingCount={pendingAnnotations.length}
                      onCheckedChange={handleSelectAll}
                    />
                 </div>
              )}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <LoadingState />
            ) : annotations.length > 0 ? (
              <AnnotationsGrid
                annotations={annotations}
                selectedItems={selectedItems}
                onSelect={handleSelectItem}
                onImageClick={handleImageClick}
              />
            ) : (
              <EmptyState />
            )}
          </div>
          
           {/* Bulk Action Bar - Sticky at bottom of left panel */}
           {selectedItems.length > 0 && (
             <div className="p-4 border-t border-border bg-background">
                <BulkActionBar
                    selectedCount={selectedItems.length}
                    onApprove={handleBulkApprove}
                    onReject={handleBulkReject}
                    isActionLoading={isBulkActionLoading}
                />
             </div>
           )}
        </div>

        {/* Right Panel - Detail */}
        <div 
            className={`h-full overflow-hidden transition-all
            ${focusedAnnotation ? 'w-full md:w-[40%]' : 'hidden md:block w-full md:w-[40%]'}
            `}
        >
           <ReviewDetailPanel 
              annotation={focusedAnnotation}
              onApprove={handleApprove}
              onReject={handleReject}
              onImageClick={handleImageClick}
              onBack={() => setFocusedAnnotationId(null)}
           />
        </div>
      </div>

      <ImageDialog
        open={imageDialogOpen}
        imageUrl={selectedImage}
        onOpenChange={setImageDialogOpen}
      />
    </div>
  );
}
