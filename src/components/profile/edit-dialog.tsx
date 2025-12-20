/**
 * Edit dialog component
 * Dialog for editing annotation captions
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserAnnotation } from "@/services/user";

interface EditDialogProps {
  annotation: UserAnnotation | null;
  caption: string;
  onCaptionChange: (caption: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function EditDialog({
  annotation,
  caption,
  onCaptionChange,
  onSave,
  onCancel,
  saving = false,
}: EditDialogProps) {
  return (
    <Dialog open={!!annotation} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Annotation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {annotation && (
            <>
              <div className="flex justify-center">
                {annotation.memeUrl ? (
                  <img
                    src={annotation.memeUrl}
                    alt="Meme"
                    className="aspect-square h-48 w-48 rounded object-cover"
                  />
                ) : (
                  <div className="aspect-square h-48 w-48 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Caption
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => onCaptionChange(e.target.value)}
                  className="min-h-[120px]"
                  placeholder="Enter your caption..."
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
          <Button onClick={onSave} disabled={saving || !caption.trim()}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}








