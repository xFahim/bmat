"use client";

import { useRouter } from "next/navigation";
import { TopNav } from "@/components/annotate/top-nav";
import { MemeUploader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminUploadPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bulk Meme Upload</h1>
            <p className="text-sm text-muted-foreground">
              Upload multiple meme images to the system
            </p>
          </div>
        </div>

        {/* Meme Uploader */}
        <div className="max-w-4xl">
          <MemeUploader />
        </div>
      </div>
    </div>
  );
}

















