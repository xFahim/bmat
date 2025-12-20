/**
 * Utility functions for status handling
 */

import { AnnotationStatus } from "@/types/annotations";
import { UserStatus } from "@/types/users";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, X } from "lucide-react";

/**
 * Get status badge component for annotations
 */
export const getAnnotationStatusBadge = (status: AnnotationStatus) => {
  switch (status) {
    case "Approved":
      return (
        <Badge variant="default">
          <Check className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "Rejected":
      return (
        <Badge variant="outline">
          <X className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
  }
};

/**
 * Get status badge component for users
 */
export const getUserStatusBadge = (status: UserStatus) => {
  return status === "Active" ? (
    <Badge variant="outline">Active</Badge>
  ) : (
    <Badge variant="outline" className="border-red-500/50 text-red-500/80">
      Banned
    </Badge>
  );
};









