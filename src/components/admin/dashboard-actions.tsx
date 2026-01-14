"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  adminApproveAllPending, 
  adminGetApprovedAnnotationsCSV 
} from "@/app/admin/actions";

export function DashboardActions() {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleApproveAll = async () => {
    if (!confirm("Are you sure you want to approve ALL pending annotations? This action cannot be undone.")) {
      return;
    }

    setIsApproving(true);
    try {
      const result = await adminApproveAllPending();
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Approved ${result.count} pending annotations.`,
        });
        // Optional: Trigger a refresh of the page or stats
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to approve all pending annotations",
        });
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
        });
    } finally {
      setIsApproving(false);
    }
  };

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    try {
      const result = await adminGetApprovedAnnotationsCSV();
      
      if (result.success && result.csv) {
        // Create a blob and link to download
        const blob = new Blob([result.csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `approved_annotations_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
            title: "Success",
            description: "CSV downloaded successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to generate CSV",
        });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to download CSV",
        });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        onClick={handleDownloadCSV} 
        disabled={isDownloading}
        className="gap-2"
      >
        {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <Download className="h-4 w-4" />
        )}
        Download CSV
      </Button>
      
      <Button 
        variant="default" 
        onClick={handleApproveAll} 
        disabled={isApproving}
        className="gap-2"
      >
        {isApproving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <CheckCheck className="h-4 w-4" />
        )}
        Approve All Pending
      </Button>
    </div>
  );
}
