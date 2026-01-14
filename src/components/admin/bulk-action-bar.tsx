/**
 * Bulk action bar component
 */

import { Button } from "@/components/ui/button";
import { CheckCheck, XCircle, Loader2 } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: () => void;
  isActionLoading?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  isActionLoading = false,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={onReject}
            className="gap-2"
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Reject Selected
          </Button>
          <Button 
            variant="default" 
            onClick={onApprove} 
            className="gap-2"
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Approve Selected
          </Button>
        </div>
      </div>
    </div>
  );
}



















