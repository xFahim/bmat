/**
 * Reusable status badge components
 */

import { AnnotationStatus } from "@/types/annotations";
import { UserStatus } from "@/types/users";
import { getAnnotationStatusBadge, getUserStatusBadge } from "@/lib/utils/status";

interface AnnotationStatusBadgeProps {
  status: AnnotationStatus;
}

export function AnnotationStatusBadge({ status }: AnnotationStatusBadgeProps) {
  return getAnnotationStatusBadge(status);
}

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return getUserStatusBadge(status);
}



