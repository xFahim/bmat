/**
 * Image preview dialog component
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageDialogProps {
  open: boolean;
  imageUrl: string;
  onOpenChange: (open: boolean) => void;
}

export function ImageDialog({
  open,
  imageUrl,
  onOpenChange,
}: ImageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Meme Preview</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Meme preview"
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}












