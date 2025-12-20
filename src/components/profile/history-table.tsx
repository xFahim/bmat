/**
 * History table component
 * Displays user annotation history in a table
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { UserAnnotation } from "@/services/user";
import { AnnotationStatusBadge } from "@/components/shared";

interface HistoryTableProps {
  annotations: UserAnnotation[];
  onEdit: (annotation: UserAnnotation) => void;
}

// Convert database status to frontend status
function convertStatus(
  status: "pending" | "approved" | "rejected"
): "Pending" | "Approved" | "Rejected" {
  return status.charAt(0).toUpperCase() + status.slice(1) as
    | "Pending"
    | "Approved"
    | "Rejected";
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function HistoryTable({
  annotations,
  onEdit,
}: HistoryTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800">
            <TableHead className="w-[100px]">Meme</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {annotations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No annotations found
              </TableCell>
            </TableRow>
          ) : (
            annotations.map((annotation) => (
              <TableRow key={annotation.id} className="border-zinc-800">
                <TableCell>
                  {annotation.memeUrl ? (
                    <img
                      src={annotation.memeUrl}
                      alt={`Meme ${annotation.id}`}
                      className="aspect-square h-16 w-16 rounded object-cover"
                    />
                  ) : (
                    <div className="aspect-square h-16 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
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
                    {annotation.caption}
                  </p>
                </TableCell>
                <TableCell>
                  <AnnotationStatusBadge
                    status={convertStatus(annotation.status)}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(annotation.created_at)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={annotation.status !== "pending"}
                    onClick={() => onEdit(annotation)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}








