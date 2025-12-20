"use client";

import { useState } from "react";
import { Button, Textarea, Badge, Card, CardContent } from "@/components/ui";
import { Loader2, ChevronDown, ChevronUp, Info } from "lucide-react";

interface AnnotationFormProps {
  caption: string;
  onCaptionChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onSkip: () => Promise<void>;
  submitting: boolean;
  disabled: boolean;
  sessionCount: number;
  debugLog?: string;
}

/**
 * Annotation Form Component
 * Form for entering and submitting annotations
 */
export function AnnotationForm({
  caption,
  onCaptionChange,
  onSubmit,
  onSkip,
  submitting,
  disabled,
  sessionCount,
  debugLog,
}: AnnotationFormProps) {
  const [isGuidelineOpen, setIsGuidelineOpen] = useState(false);

  return (
    <div className="flex h-full lg:w-[35%] border-l border-border">
      <div className="flex flex-col w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Annotate</h2>
          <Badge variant="outline" className="text-sm">
            {sessionCount} sessions
          </Badge>
        </div>

        {/* Guidelines Section */}
        <Card className="mb-4 border-primary/20 bg-primary/5 py-0">
          <button
            onClick={() => setIsGuidelineOpen(!isGuidelineOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-primary/10 transition-colors rounded-t-lg"
            type="button"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">
                📝 Free-Form Meme Description Guidelines
              </span>
            </div>
            {isGuidelineOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {isGuidelineOpen && (
            <CardContent className="pt-0 pb-4 px-4 space-y-4">
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  Please describe the meme in your own words. Your description
                  should help someone who has never seen the meme understand it.
                </p>

                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    You may follow this structure (no need to label sections):
                  </p>
                  <ul className="space-y-2 ml-4 list-disc text-muted-foreground">
                    <li>
                      <span className="font-semibold text-foreground">
                        Context (if known)
                      </span>
                      <br />
                      Briefly mention the political or social event, person, or
                      situation the meme refers to.
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">
                        What is shown in the image
                      </span>
                      <br />
                      Describe the visible elements: people, objects,
                      expressions, text, symbols, or setting.
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">
                        What the meme is trying to convey
                      </span>
                      <br />
                      Explain the implied message, criticism, or joke in simple
                      terms.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="font-semibold text-foreground mb-2">
                    ⚠️ Important notes:
                  </p>
                  <ul className="space-y-1.5 ml-4 list-disc text-muted-foreground">
                    <li>Write in English (use natural language).</li>
                    <li>Do not overanalyze or add personal opinions.</li>
                    <li>If the context is unclear, skip the annotation.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Textarea */}
        <Textarea
          placeholder="Enter your caption here..."
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          className="flex-1 min-h-[300px] mb-4"
          disabled={disabled || submitting}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={disabled || submitting}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || submitting || !caption.trim()}
            className="flex-1"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {/* Debug Log */}
        {debugLog && (
          <div className="mt-4 p-3 bg-muted rounded-md text-xs font-mono text-red-500">
            {debugLog}
          </div>
        )}
      </div>
    </div>
  );
}
