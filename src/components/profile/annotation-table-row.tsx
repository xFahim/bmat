/**
 * Annotation table row component
 */

import { Annotation } from "@/types/annotations";
import { Button } from "@/components/ui/button";
import { AnnotationStatusBadge } from "@/components/shared";
import { Pencil } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface AnnotationTableRowProps {
  annotation: Annotation;
  onEdit: (annotation: Annotation) => void;
}

export function AnnotationTableRow({
  annotation,
  onEdit,
}: AnnotationTableRowProps) {
  return (
    <TableRow className="border-zinc-800">
      <TableCell>
        <img
          src={annotation.memeUrl}
          alt={`Meme ${annotation.id}`}
          className="aspect-square h-16 w-16 rounded object-cover"
        />
      </TableCell>
      <TableCell>
        <p
          className="max-w-md text-sm"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {annotation.explanation}
        </p>
      </TableCell>
      <TableCell>
        <AnnotationStatusBadge status={annotation.status} />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={annotation.status !== "Pending"}
          onClick={() => onEdit(annotation)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}















