"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileImage, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function MemeUploader() {
  const [sourceGroup, setSourceGroup] = useState("uncategorized");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
        addLog(`📁 Added ${droppedFiles.length} file(s) from drag & drop`);
      }
    },
    [addLog]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith("image/")
      );

      if (selectedFiles.length > 0) {
        setFiles((prev) => [...prev, ...selectedFiles]);
        addLog(`📁 Added ${selectedFiles.length} file(s) from file picker`);
      }
    },
    [addLog]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
      addLog(`🗑️ Removed file at index ${index + 1}`);
    },
    [addLog]
  );

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files",
        description: "Please select at least one image file to upload.",
      });
      return;
    }

    if (!sourceGroup.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Source Group",
        description: "Please enter a source group name.",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setLogs([]);
    addLog("🚀 Starting upload process...");

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          addLog(`📤 Uploading ${file.name}...`);

          // Create form data for the API route
          const formData = new FormData();
          formData.append("file", file);
          formData.append("sourceGroup", sourceGroup.trim());

          // Call the server-side API route
          const response = await fetch("/api/admin/upload-meme", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              result.error || `Upload failed with status ${response.status}`
            );
          }

          successCount++;
          addLog(`✅ Uploaded ${result.fileName || file.name}`);
        } catch (error) {
          failCount++;
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          addLog(`❌ Failed ${file.name}: ${errorMessage}`);
        }

        // Step C: Update progress
        const newProgress = ((i + 1) / files.length) * 100;
        setProgress(newProgress);
      }

      // Completion
      const message = `Upload complete! ${successCount} succeeded, ${failCount} failed.`;
      addLog(`🎉 ${message}`);

      toast({
        title: "Upload Complete",
        description: message,
      });

      // Clear files after successful completion
      if (failCount === 0) {
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
      });
      addLog(
        `❌ Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  }, [files, sourceGroup, addLog, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Batch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Source Group Input */}
        <div className="space-y-2">
          <label htmlFor="source-group" className="text-sm font-medium">
            Source / Group Name
          </label>
          <Input
            id="source-group"
            value={sourceGroup}
            onChange={(e) => setSourceGroup(e.target.value)}
            placeholder="uncategorized"
            disabled={isUploading}
          />
        </div>

        {/* File Dropzone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Files</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "relative flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
              isUploading && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-center text-sm text-muted-foreground">
              Drag & drop images here, or click to select
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Multiple files supported • Images only
            </p>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Selected Files ({files.length})
              </p>
              <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border p-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 rounded-sm bg-secondary/50 p-2 text-sm"
                  >
                    <FileImage className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    {!isUploading && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {isUploading
                ? `Uploading... ${Math.round(progress)}%`
                : `Ready to upload ${files.length} file${
                    files.length !== 1 ? "s" : ""
                  }`}
            </p>
            {isUploading && <Progress value={progress} />}
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Upload Logs</p>
            <div className="max-h-[100px] overflow-y-auto rounded-md border bg-muted/30 p-3">
              <pre className="text-xs font-mono text-muted-foreground">
                {logs.join("\n")}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Start Upload"}
        </Button>
      </CardFooter>
    </Card>
  );
}
