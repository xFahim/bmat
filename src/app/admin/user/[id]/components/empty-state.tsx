/**
 * Empty state component
 * Shown when there are no annotations
 */

import { ShieldAlert } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">No annotations found</p>
    </div>
  );
}















