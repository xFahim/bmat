/**
 * Annotations grid component
 * Displays annotations in a responsive grid layout
 */

import { Annotation } from "@/types/annotations";
import { AnnotationCard } from "@/components/admin";

interface AnnotationsGridProps {
  annotations: Annotation[];
  selectedItems: string[];
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onImageClick: (url: string) => void;
}

export function AnnotationsGrid({
  annotations,
  selectedItems,
  onSelect,
  onApprove,
  onReject,
  onImageClick,
}: AnnotationsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {annotations.map((annotation) => (
        <AnnotationCard
          key={annotation.id}
          annotation={annotation}
          isSelected={selectedItems.includes(annotation.id)}
          onSelect={onSelect}
          onApprove={onApprove}
          onReject={onReject}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}














