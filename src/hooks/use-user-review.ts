/**
 * Hook for user review page
 * Manages all state and business logic for reviewing user annotations
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { Annotation } from "@/types/annotations";
import { UserData } from "@/types/users";
import { type PendingAnnotation } from "@/services/admin";
import { 
  getAdminUserDetails, 
  getAdminPendingAnnotations, 
  adminReviewAnnotation, 
  adminBanUser 
} from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";

export interface UseUserReviewReturn {
  // State
  annotations: Annotation[];
  user: UserData;
  selectedItems: string[];
  loading: boolean;
  isBanning: boolean;
  imageDialogOpen: boolean;
  selectedImage: string;

  // Computed
  pendingCount: number;
  pendingAnnotations: Annotation[];
  allSelected: boolean;
  someSelected: boolean;

  // Actions
  handleSelectItem: (id: string, checked: boolean) => void;
  handleSelectAll: (checked: boolean) => void;
  handleApprove: (id: string) => Promise<void>;
  handleReject: (id: string) => Promise<void>;
  handleBulkApprove: () => Promise<void>;
  handleBulkReject: () => Promise<void>;
  handleImageClick: (url: string) => void;
  handleBan: () => Promise<boolean>;
  setImageDialogOpen: (open: boolean) => void;
  focusedAnnotationId: string | null;
  setFocusedAnnotationId: (id: string | null) => void;
  focusedAnnotation: Annotation | null;
}

/**
 * Transforms PendingAnnotation to Annotation format
 */
function transformPendingAnnotation(ann: PendingAnnotation): Annotation {
  return {
    id: String(ann.id),
    memeUrl: ann.memeUrl,
    explanation: ann.caption,
    status: "Pending" as const,
    memeId: ann.memeId.toString(),
  };
}

/**
 * Hook for managing user review page state and operations
 * @param userId - User ID to review
 * @returns User review state and handlers
 */
export function useUserReview(userId: string): UseUserReviewReturn {
  const { toast } = useToast();

  // State
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [user, setUser] = useState<UserData>({
    name: "Loading...",
    email: "",
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const [focusedAnnotationId, setFocusedAnnotationId] = useState<string | null>(null);

  // Fetch user details and pending annotations on mount
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setLoading(true);
      // Fetch user details and pending annotations in parallel
      const [userResult, annotationsResult] = await Promise.all([
        getAdminUserDetails(userId),
        getAdminPendingAnnotations(userId),
      ]);

      if (userResult.success && userResult.user) {
        setUser({
          name: userResult.user.user.name,
          email: userResult.user.user.email,
          avatar: userResult.user.user.avatar,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: userResult.error || "Failed to load user details",
        });
      }

      if (annotationsResult.success) {
        // Transform PendingAnnotation to Annotation format
        const transformedAnnotations = annotationsResult.annotations.map(
          transformPendingAnnotation
        );
        setAnnotations(transformedAnnotations);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: annotationsResult.error || "Failed to load annotations",
        });
      }

      setLoading(false);
    }

    fetchData();
  }, [userId, toast]);

  // Auto-focus first pending item on load
  useEffect(() => {
    if (!focusedAnnotationId && annotations.length > 0) {
      const firstPending = annotations.find(a => a.status === "Pending");
      if (firstPending) {
        setFocusedAnnotationId(firstPending.id);
      } else if (annotations.length > 0) {
         setFocusedAnnotationId(annotations[0].id);
      }
    }
  }, [annotations, focusedAnnotationId]);

  // Computed values
  const pendingCount = useMemo(
    () => annotations.filter((a) => a.status === "Pending").length,
    [annotations]
  );

  const pendingAnnotations = useMemo(
    () => annotations.filter((a) => a.status === "Pending"),
    [annotations]
  );

  const allSelected = useMemo(
    () =>
      pendingAnnotations.length > 0 &&
      selectedItems.length === pendingAnnotations.length,
    [pendingAnnotations.length, selectedItems.length]
  );

  const someSelected = useMemo(
    () =>
      selectedItems.length > 0 &&
      selectedItems.length < pendingAnnotations.length,
    [selectedItems.length, pendingAnnotations.length]
  );

  const focusedAnnotation = useMemo(
    () => annotations.find((a) => a.id === focusedAnnotationId) || null,
    [annotations, focusedAnnotationId]
  );

  // Selection handlers
  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const pendingIds = pendingAnnotations.map((a) => a.id);
      setSelectedItems(checked ? pendingIds : []);
    },
    [pendingAnnotations]
  );

  // Review handlers
  const handleApprove = useCallback(
    async (id: string) => {
      const result = await adminReviewAnnotation(id, "approved");

      if (result.success) {
        // Optimistic UI update
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === id ? { ...ann, status: "Approved" as const } : ann
          )
        );
        setSelectedItems((prev) => prev.filter((item) => item !== id));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to approve annotation",
        });
      }
    },
    [toast]
  );

  const handleReject = useCallback(
    async (id: string) => {
      const result = await adminReviewAnnotation(id, "rejected");

      if (result.success) {
        // Optimistic UI update
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === id ? { ...ann, status: "Rejected" as const } : ann
          )
        );
        setSelectedItems((prev) => prev.filter((item) => item !== id));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to reject annotation",
        });
      }
    },
    [toast]
  );

  // Bulk operations
  const handleBulkApprove = useCallback(async () => {
    const promises = selectedItems.map((id) =>
      adminReviewAnnotation(id, "approved")
    );

    const results = await Promise.all(promises);
    const allSuccess = results.every((r) => r.success);

    if (allSuccess) {
      // Optimistic UI update
      setAnnotations((prev) =>
        prev.map((ann) =>
          selectedItems.includes(ann.id)
            ? { ...ann, status: "Approved" as const }
            : ann
        )
      );
      setSelectedItems([]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some annotations failed to approve",
      });
    }
  }, [selectedItems, toast]);

  const handleBulkReject = useCallback(async () => {
    const promises = selectedItems.map((id) =>
      adminReviewAnnotation(id, "rejected")
    );

    const results = await Promise.all(promises);
    const allSuccess = results.every((r) => r.success);

    if (allSuccess) {
      // Optimistic UI update
      setAnnotations((prev) =>
        prev.map((ann) =>
          selectedItems.includes(ann.id)
            ? { ...ann, status: "Rejected" as const }
            : ann
        )
      );
      setSelectedItems([]);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some annotations failed to reject",
      });
    }
  }, [selectedItems, toast]);

  // Image dialog handler
  const handleImageClick = useCallback((url: string) => {
    // If url is passed as annotation ID, we focus, if it is a URL, we open dialog (backward compat/dual use)
    // Actually, based on my plan, grid calls this with ID to focus. 
    // Detail panel will call a different function to open FULL SCREEN.
    // Let's repurpose this: if it looks like a URL, open dialog. If ID, focus. 
    // Simpler: The Grid passes ID. The Detail Panel passes URL.
    // Simpler: The Grid passes ID. The Detail Panel passes URL.
    if (!url) return;
    
    // Check if it's a URL (rudimentary check but sufficient for this context)
    // We assume IDs don't start with http
    if (typeof url === 'string' && url.startsWith("http")) {
        setSelectedImage(url);
        setImageDialogOpen(true);
    } else {
        setFocusedAnnotationId(url);
    }
  }, []);

  // Ban handler
  const handleBan = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;

    // Confirm action
    if (
      !confirm(
        "Are you sure you want to ban this user? This will reject all their pending annotations."
      )
    ) {
      return false;
    }

    setIsBanning(true);
    const result = await adminBanUser(userId);

    if (result.success) {
      toast({
        title: "Success",
        description: "User has been banned and all pending annotations rejected",
      });
      setIsBanning(false);
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to ban user",
      });
      setIsBanning(false);
      return false;
    }
  }, [userId, toast]);

  return {
    // State
    annotations,
    user,
    selectedItems,
    loading,
    isBanning,
    imageDialogOpen,
    selectedImage,

    // Computed
    pendingCount,
    pendingAnnotations,
    allSelected,
    someSelected,

    // Actions
    handleSelectItem,
    handleSelectAll,
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,
    handleImageClick,
    handleBan,
    setImageDialogOpen,
    focusedAnnotationId,
    setFocusedAnnotationId,
    focusedAnnotation,
  };
}

