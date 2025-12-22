/**
 * Type definitions for annotations
 */

export type AnnotationStatus = "Approved" | "Pending" | "Rejected";

export interface Annotation {
  id: string;
  memeUrl: string;
  explanation: string;
  status: AnnotationStatus;
  memeId?: string;
}
















