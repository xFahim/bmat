"use client"

import { Button, Textarea } from "@/components/ui";

interface AnnotationPanelProps {
  caption: string;
  onCaptionChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  disabled?: boolean;
}

export function AnnotationPanel({
  caption,
  onCaptionChange,
  onSubmit,
  submitting = false,
  disabled = false,
}: AnnotationPanelProps) {
  const handleSkip = () => {
    onCaptionChange("");
  };

  return (
    <div className="flex h-full w-full flex-col border-l border-border bg-background">
      {/* Stats Section */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Session Progress
          </span>
          <span className="text-sm text-muted-foreground">-</span>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="border-b border-zinc-800 p-4">
        <div className="rounded-md border border-zinc-800 bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Instructions 📝
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>Describe the meme in your own words.</p>
            <p className="flex items-start gap-2">
              <span className="text-foreground">1️⃣</span>
              <span>
                <span className="text-foreground font-medium">Entities involved</span> - Who or what is in the meme?
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-foreground">2️⃣</span>
              <span>
                <span className="text-foreground font-medium">Sarcasm/Humor source</span> - What makes it funny or sarcastic?
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-foreground">3️⃣</span>
              <span>
                <span className="text-foreground font-medium">Local Context/Event</span> - Any cultural or regional references?
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex-1 overflow-hidden p-4">
        <Textarea
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Enter your annotation here..."
          className="h-full resize-none"
          disabled={disabled || submitting}
        />
      </div>

      {/* Actions Section */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={onSubmit}
            className="flex-1"
            disabled={!caption.trim() || submitting || disabled}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1"
            disabled={submitting || disabled}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

