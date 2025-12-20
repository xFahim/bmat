import { Highlighter } from "@/components/ui/highlighter";
import { HIGHLIGHTER_COLORS } from "@/constants";

/**
 * Hero Subtitle Component
 * Displays the subtitle with highlighted "Annotation" word
 */
export function HeroSubtitle() {
  return (
    <h2 className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
      Bangla Meme{" "}
      <Highlighter action="underline" color={HIGHLIGHTER_COLORS.YELLOW} strokeWidth={3}>
        Annotation
      </Highlighter>{" "}
      Tool
    </h2>
  );
}

