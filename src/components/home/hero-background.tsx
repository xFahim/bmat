import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";

/**
 * HeroBackground Component
 *
 * Displays a grid pattern with gradient masks at top and bottom.
 * Creates a visual frame effect that fades the grid at the edges.
 *
 * @returns {JSX.Element} A grid pattern with gradient masking
 */
export function HeroBackground() {
  return (
    <GridPattern
      className={cn(
        "mask-[linear-gradient(to_bottom,transparent_0%,transparent_10%,black_40%,black_60%,transparent_90%,transparent_100%)]",
        "fill-white/20 stroke-white/20"
      )}
    />
  );
}
