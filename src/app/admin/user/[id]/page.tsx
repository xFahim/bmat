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
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <UserHeader
          user={user}
          pendingCount={pendingCount}
          onBack={handleBack}
          onBan={handleBanWithRedirect}
          isBanning={isBanning}
        />

        {loading ? (
          <LoadingState />
        ) : (
          <>
            <SelectAllCheckbox
              checked={allSelected || someSelected}
              pendingCount={pendingAnnotations.length}
              onCheckedChange={handleSelectAll}
            />

            {annotations.length > 0 ? (
              <AnnotationsGrid
                annotations={annotations}
                selectedItems={selectedItems}
                onSelect={handleSelectItem}
                onApprove={handleApprove}
                onReject={handleReject}
                onImageClick={handleImageClick}
              />
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </div>

      <BulkActionBar
        selectedCount={selectedItems.length}
        onApprove={handleBulkApprove}
        onReject={handleBulkReject}
      />

      <ImageDialog
        open={imageDialogOpen}
        imageUrl={selectedImage}
        onOpenChange={setImageDialogOpen}
      />
    </div>
  );
}
