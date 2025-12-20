/**
 * Edit annotation dialog component
 */

import { Annotation } from "@/types/annotations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditAnnotationDialogProps {
  annotation: Annotation | null;
  explanation: string;
  onExplanationChange: (explanation: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function EditAnnotationDialog({
  annotation,
  explanation,
  onExplanationChange,
  onSave,
  onCancel,
  saving = false,
}: EditAnnotationDialogProps) {
  return (
    <Dialog open={!!annotation} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[1000px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Edit Annotation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {annotation && (
            <>
              <div className="flex justify-center">
                <img
                  src={annotation.memeUrl}
                  alt="Meme"
                  className="aspect-square h-48 w-48 rounded object-cover"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Explanation
                </label>
                <Textarea
                  value={explanation}
                  onChange={(e) => onExplanationChange(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Enter your explanation..."
                  disabled={saving}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving || !explanation.trim()}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


