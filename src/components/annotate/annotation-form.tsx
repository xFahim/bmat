"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Textarea, Badge, Card, CardContent } from "@/components/ui";
import { Loader2, ChevronDown, ChevronUp, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full lg:w-[35%] lg:min-w-[400px] lg:max-w-[600px] lg:flex-none border-t lg:border-t-0 lg:border-l border-border bg-background overflow-y-auto">
      <div className="flex flex-col w-full px-6 py-8 min-h-full">
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
              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed">
                  Focus on the <span className="font-semibold text-foreground">Context</span> (if you know it) and the <span className="font-semibold text-foreground">Implication</span> (who is being mocked/what is the message).
                </p>

                <div className="space-y-2">
                  <p className="font-medium text-foreground">
                    Structure:
                  </p>
                  <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
                    <li>
                      <span className="font-semibold text-foreground">Context:</span> What event/person is this about?
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Visuals:</span> What is clearly shown?
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Meaning:</span> What is the joke or criticism?
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                   <button 
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-primary font-medium hover:underline text-xs flex items-center gap-1"
                   >
                     View Example Annotation ↗
                   </button>
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
          className="flex-1 min-h-[150px] mb-6 resize-none text-base leading-relaxed p-4"
          disabled={disabled || submitting}
        />

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onSkip}
            disabled={disabled || submitting}
            className="flex-1 h-12 text-base"
          >
            Skip
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || submitting || !caption.trim()}
            className="flex-1 h-12 text-base font-semibold"
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


      {/* EXAMPLE IMAGE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-full w-full max-w-7xl overflow-hidden rounded-lg flex items-center justify-center pointer-events-none"
            >
               <div className="relative w-full h-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 z-50 rounded-full bg-zinc-900/50 p-2 text-white hover:bg-zinc-900 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <Image
                    src="/example1.png"
                    alt="Example meme annotation full"
                    fill
                    className="object-contain"
                  />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
