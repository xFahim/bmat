/**
 * Annotation card component for admin review
 */

import { Annotation } from "@/types/annotations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CheckCheck, XCircle } from "lucide-react";

interface AnnotationCardProps {
  annotation: Annotation;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onImageClick: (url: string) => void;
}

export function AnnotationCard({
  annotation,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  onImageClick,
}: AnnotationCardProps) {
  const isPending = annotation.status === "Pending";

  return (
    <Card className="border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <div className="flex items-center gap-2">
          {isPending && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) =>
                onSelect(annotation.id, checked as boolean)
              }
            />
          )}
          <span className="text-xs font-mono text-muted-foreground">
            {annotation.memeId || annotation.id}
          </span>
        </div>
        {!isPending && (
          <Badge variant="outline" className="text-xs">
            {annotation.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className="cursor-pointer rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
          onClick={() => onImageClick(annotation.memeUrl)}
        >
          <img
            src={annotation.memeUrl}
            alt={annotation.memeId || annotation.id}
            className="w-full aspect-square object-cover"
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {annotation.explanation}
        </p>
      </CardContent>
      {isPending && (
        <CardFooter className="flex gap-2 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onApprove(annotation.id)}
          >
            <CheckCheck className="h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onReject(annotation.id)}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}









