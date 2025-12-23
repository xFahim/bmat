"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Upload, 
  FileImage, 
  X, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Trash2 
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Types ---

type UploadStatus = "idle" | "pending" | "uploading" | "success" | "error" | "paused";

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  fileName?: string;
}

// --- Constants ---

const RATE_LIMIT_DELAY_MS = 1500; 

export function MemeUploader() {
  const [sourceGroup, setSourceGroup] = useState("uncategorized");
  const [items, setItems] = useState<UploadItem[]>([]);
  // Ref to access latest items in async loop
  const itemsRef = useRef<UploadItem[]>([]); 
  
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for loop control to avoid closure staleness
  const processingRef = useRef(false);
  const pausedRef = useRef(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sync ref with state
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    processingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // --- Helpers ---

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const updateItem = useCallback((id: string, updates: Partial<UploadItem>) => {
    setItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  // --- Handlers ---

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (droppedFiles.length > 0) {
      const newItems: UploadItem[] = droppedFiles.map((file) => ({
        id: generateId(),
        file,
        status: "idle",
        progress: 0,
      }));
      setItems((prev) => [...prev, ...newItems]);
      toast({ title: `Added ${droppedFiles.length} files` });
    }
  }, [toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedFiles.length > 0) {
      const newItems: UploadItem[] = selectedFiles.map((file) => ({
        id: generateId(),
        file,
        status: "idle",
        progress: 0,
      }));
      setItems((prev) => [...prev, ...newItems]);
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== "success"));
  }, []);

  const handleRetryFailed = useCallback(() => {
    setItems((prev) => 
      prev.map((item) => 
        item.status === "error" ? { ...item, status: "idle", error: undefined, progress: 0 } : item
      )
    );
  }, []);

  // --- Core Processing Loop ---

  const uploadSingleFile = async (item: UploadItem) => {
    updateItem(item.id, { status: "uploading", progress: 0 });

    try {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("sourceGroup", sourceGroup.trim());

      const response = await fetch("/api/admin/upload-meme", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Status ${response.status}`);
      }

      updateItem(item.id, { 
        status: "success", 
        progress: 100, 
        fileName: result.fileName 
      });
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      updateItem(item.id, { status: "error", error: msg, progress: 0 });
      return false;
    }
  };

  const runQueue = async () => {
    // Avoid double instantiation if called rapidly
    // But since this is only called from handleStart, and we assume processRef handles the logic:
    
    // Safety Break Counter
    let loopCount = 0;
    
    while (processingRef.current) {
        // Infinite loop guard? No, intended to run until done.
        
        // 1. Check Pause
        if (pausedRef.current) {
            await new Promise(r => setTimeout(r, 500)); // Poll
            continue;
        }

        // 2. Find Candidate
        const currentItems = itemsRef.current;
        const candidate = currentItems.find(i => i.status === 'idle');

        if (!candidate) {
            // Queue Finished
            setIsProcessing(false);
            processingRef.current = false;
            toast({ title: "Queue processing finished" });
            break;
        }

        // 3. Upload
        const success = await uploadSingleFile(candidate);

        // 4. Rate Limit
        if (success) {
            await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY_MS));
        } else {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
  };

  // --- Controls ---

  const handleStart = () => {
    if (!sourceGroup.trim()) {
      toast({ variant: "destructive", title: "Enter Source Group" });
      return;
    }
    
    if (!isProcessing) {
        setIsProcessing(true);
        setIsPaused(false);
        processingRef.current = true;
        pausedRef.current = false;
        
        // Start the loop (fire and forget)
        runQueue();
    } else if (isPaused) {
       setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsProcessing(false);
    setIsPaused(false);
    processingRef.current = false;
  };

  // derived metrics
  const total = items.length;
  const completed = items.filter(i => i.status === "success").length;
  const failed = items.filter(i => i.status === "error").length;
  const pending = items.filter(i => i.status === "idle" || i.status === "pending" || i.status === "uploading").length;
  const progressPercent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:h-[600px]">
      <div className="flex flex-col gap-6">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Batch Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Source Group Name</label>
              <Input
                value={sourceGroup}
                onChange={(e) => setSourceGroup(e.target.value)}
                placeholder="e.g. reddit_funny_2024"
                disabled={isProcessing && !isPaused}
              />
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-1 min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                Drag & drop or click to add files
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                 {items.length} files in queue
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
             <div className="grid grid-cols-2 gap-2 w-full">
                {!isProcessing ? (
                  <Button onClick={handleStart} disabled={items.length === 0 || pending === 0} className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Start Upload
                  </Button>
                ) : (
                   isPaused ? (
                    <Button onClick={handleResume} variant="secondary" className="w-full">
                      <Play className="mr-2 h-4 w-4" /> Resume
                    </Button>
                   ) : (
                    <Button onClick={handlePause} variant="secondary" className="w-full">
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </Button>
                   )
                )}
                
                <Button variant="outline" onClick={handleStop} disabled={!isProcessing}>
                    Stop
                </Button>
             </div>
             
             {failed > 0 && !isProcessing && (
                <Button variant="destructive" onClick={handleRetryFailed} className="w-full">
                   <RefreshCw className="mr-2 h-4 w-4" /> Retry {failed} Failed
                </Button>
             )}
          </CardFooter>
        </Card>
      </div>

      <Card className="flex flex-col h-full overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Queue ({completed}/{total})</CardTitle>
            <div className="flex gap-2">
                {completed > 0 && (
                    <Button size="sm" variant="ghost" onClick={handleClearCompleted} title="Clear Completed">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full max-h-[500px] w-full p-4">
             {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <p>Queue is empty</p>
                </div>
             ) : (
                <div className="space-y-2">
                   {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 animate-in fade-in transition-all">
                         <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                             <FileImage className="h-full w-full p-2 text-muted-foreground" />
                         </div>
                         
                         <div className="flex-1 min-w-0">
                             <div className="flex items-center justify-between">
                                 <p className="text-sm font-medium truncate" title={item.file.name}>{item.file.name}</p>
                                 <Badge variant={
                                     item.status === 'success' ? 'default' : 
                                     item.status === 'error' ? 'destructive' : 
                                     item.status === 'uploading' ? 'secondary' : 'outline'
                                 } className="ml-2 text-[10px] uppercase">
                                     {item.status}
                                 </Badge>
                             </div>
                             
                             {item.error && (
                                 <p className="text-xs text-destructive truncate mt-1">{item.error}</p>
                             )}
                             
                             {item.status === 'uploading' && (
                                <Progress value={item.progress} className="h-1 mt-2" />
                             )}
                         </div>

                         <div className="flex-shrink-0">
                             {item.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                             {item.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                             {(item.status === 'idle' || item.status === 'pending') && (
                                 <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleRemoveItem(item.id)}>
                                     <X className="h-4 w-4" />
                                 </Button>
                             )}
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
