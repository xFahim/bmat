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
  onImageClick: (id: string) => void;
}

export function AnnotationsGrid({
  annotations,
  selectedItems,
  onSelect,
  onImageClick,
}: AnnotationsGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {annotations.map((annotation) => (
        <AnnotationCard
          key={annotation.id}
          annotation={annotation}
          isSelected={selectedItems.includes(annotation.id)} // Checkbox selection
          onSelect={onSelect}
          onImageClick={onImageClick} // Handles focusing
        />
      ))}
    </div>
  );
}















