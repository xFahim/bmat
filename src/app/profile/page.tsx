"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateAnnotation } from "@/services/user";
import type { Annotation } from "@/types/annotations";
import {
  ProfileStatsSection,
  AnnotationTable,
  EditAnnotationDialog,
} from "@/components/profile";
import { TopNav } from "@/components/annotate/top-nav";
import { useToast } from "@/hooks/use-toast";
import { Highlighter } from "@/components/ui/highlighter";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";

export default function ProfilePage() {
  const router = useRouter();
  const { 
    profile: userProfile, 
    annotations, 
    isAdmin, 
    loading, 
    refreshProfile 
  } = useUserContext();
  
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const [editedExplanation, setEditedExplanation] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Calculate stats from context data
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

        // Refresh data via Context
        await refreshProfile();
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

  if (loading && !userProfile) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <TopNav />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 flex-col p-6 lg:p-10">
        
        {/* TOP PART: Profile Avatar and Header */}
        <section className="flex flex-col items-center justify-center space-y-6 py-8 mb-10 shrink-0">
          <Avatar className="h-32 w-32 border-4 border-zinc-800 shadow-2xl">
            {userProfile?.avatarUrl && (
              <AvatarImage 
                src={userProfile.avatarUrl} 
                alt={userProfile.name} 
              />
            )}
          </Avatar>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Hey,{" "}
              <Highlighter action="underline" color="#eab308">
                {userProfile?.name}
              </Highlighter>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Welcome back to your dashboard. Here is an overview of your contributions and history.
            </p>
            
            {isAdmin && (
              <div className="pt-4">
                <Button 
                  onClick={() => router.push("/admin")}
                  className="gap-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-400 border border-yellow-500/50"
                  variant="outline"
                >
                  <ShieldAlert className="h-4 w-4" />
                  View Admin Dashboard
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM PART: Split Horizontally */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0"> 
          
          {/* Part 1: Your Valuable Contribution */}
          <div className="h-full">
            <ProfileStatsSection
              totalAnnotated={stats.total}
              pendingReview={stats.pending}
              approved={stats.approved}
            />
          </div>

          {/* Part 2: Annotation History */}
          <div className="h-full">
             <AnnotationTable annotations={annotations} onEdit={handleEditClick} />
          </div>

        </div>
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

