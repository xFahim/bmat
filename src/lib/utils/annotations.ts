/**
 * Utility functions for annotations
 */

import { Annotation } from "@/types/annotations";

/**
 * Filter annotations based on search query
 */
export const filterAnnotations = (
  annotations: Annotation[],
  searchQuery: string
): Annotation[] => {
  if (!searchQuery.trim()) {
    return annotations;
  }
  const query = searchQuery.toLowerCase();
  return annotations.filter(
    (ann) =>
      ann.explanation.toLowerCase().includes(query) ||
      ann.status.toLowerCase().includes(query)
  );
};

/**
 * Calculate annotation statistics
 */
export const calculateAnnotationStats = (annotations: Annotation[]) => {
  return {
    total: annotations.length,
    pending: annotations.filter((a) => a.status === "Pending").length,
    approved: annotations.filter((a) => a.status === "Approved").length,
    rejected: annotations.filter((a) => a.status === "Rejected").length,
  };
};









