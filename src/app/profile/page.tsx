"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { getUserStats, getUserHistory, updateAnnotation } from "@/services/user";
import type { UserStats, UserAnnotation } from "@/services/user";
import {
  ProfileStatsSection,
  AnnotationTable,
  EditAnnotationDialog,
} from "@/components/profile";
import { Annotation } from "@/types/annotations";
import { TopNav } from "@/components/annotate/top-nav";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const [editedExplanation, setEditedExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Fetch annotations function
  const fetchAnnotations = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to get user information. Please refresh the page.",
        });
        setLoading(false);
        return;
      }

      if (!currentUser) {
        console.warn("No user found - user not authenticated");
        setLoading(false);
        return;
      }

      // Fetch history and convert to Annotation format
      const historyResult = await getUserHistory(supabase, currentUser.id);
      if (historyResult.success) {
        const convertedAnnotations: Annotation[] = historyResult.annotations.map(
          (item) => ({
            id: item.id,
            memeUrl: item.memeUrl,
            explanation: item.caption,
            status:
              item.status.charAt(0).toUpperCase() +
              item.status.slice(1) as "Pending" | "Approved" | "Rejected",
            memeId: item.meme_id.toString(),
          })
        );
        setAnnotations(convertedAnnotations);
      } else {
        console.error("Error fetching history:", historyResult.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: historyResult.error || "Failed to fetch annotations",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch annotations on mount
  useEffect(() => {
    fetchAnnotations();
  }, [fetchAnnotations]);

  // Calculate stats from annotations
  const stats = {
    total: annotations.length,
    pending: annotations.filter((a) => a.status === "Pending").length,
    approved: annotations.filter((a) => a.status === "Approved").length,
    rejected: annotations.filter((a) => a.status === "Rejected").length,
  };

  const handleEditClick = (annotation: Annotation) => {
    if (annotation.status === "Pending") {
      setEditingAnnotation(annotation);
      setEditedExplanation(annotation.explanation);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingAnnotation || !editingAnnotation.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid annotation data",
      });
      return;
    }

    try {
      setSaving(true);
      const supabase = createClient();

      const result = await updateAnnotation(
        supabase,
        String(editingAnnotation.id),
        editedExplanation
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Annotation updated successfully",
        });

        // Close dialog first
        setEditingAnnotation(null);
        setEditedExplanation("");

        // Refresh data from server to ensure consistency
        await fetchAnnotations();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to update annotation",
        });
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAnnotation(null);
    setEditedExplanation("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopNav />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left Side - Stats Section */}
        <ProfileStatsSection
          totalAnnotated={stats.total}
          pendingReview={stats.pending}
          approved={stats.approved}
        />

        {/* Right Side - History Section */}
        <AnnotationTable annotations={annotations} onEdit={handleEditClick} />
      </div>

      {/* Edit Dialog */}
      <EditAnnotationDialog
        annotation={editingAnnotation}
        explanation={editedExplanation}
        onExplanationChange={setEditedExplanation}
        onSave={handleSaveChanges}
        onCancel={handleCancelEdit}
        saving={saving}
      />
    </div>
  );
}
