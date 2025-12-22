/**
 * Profile stats section component
 */

import { GridPattern } from "@/components/ui/grid-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Highlighter } from "@/components/ui/highlighter";
import { Button } from "@/components/ui/button";
import { HIGHLIGHTER_COLORS } from "@/constants";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileStatsSectionProps {
  totalAnnotated: number;
  pendingReview: number;
  approved: number;
}

export function ProfileStatsSection({
  totalAnnotated,
  pendingReview,
  approved,
}: ProfileStatsSectionProps) {
  const router = useRouter();

  return (
    <div className="relative w-full lg:w-[40%]">
      <GridPattern className="absolute inset-0 mask-[linear-gradient(to_bottom,transparent_0%,transparent_10%,black_40%,black_60%,transparent_90%,transparent_100%)] fill-white/20 stroke-white/20" />
      <div className="sticky top-24 z-10 flex h-full min-h-[calc(100vh-8rem)] flex-col">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/annotate")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Canvas
          </Button>
        </div>
        <h2 className="mb-12 text-2xl font-bold">
          🏆 Your Valuable Contribution
        </h2>

        <div className="flex flex-1 flex-col items-center justify-center space-y-8">
          {/* Total Annotated - Top */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-7xl font-bold">
              <NumberTicker value={totalAnnotated} />
            </div>
            <div className="text-sm text-muted-foreground">
              <Highlighter
                action="underline"
                color={HIGHLIGHTER_COLORS.YELLOW}
                strokeWidth={3}
              >
                Total Annotated
              </Highlighter>
            </div>
          </div>

          {/* Bottom Row - Pending Review and Approved */}
          <div className="flex items-center justify-center gap-12">
            {/* Pending Review - Left */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-7xl font-bold">
                <NumberTicker value={pendingReview} />
              </div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>

            {/* Approved - Right */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-7xl font-bold text-green-500">
                <NumberTicker value={approved} />
              </div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>

        </div>
        {/* Footer Link */}
        <div className="mt-auto pt-8 flex justify-center">
          <button
            onClick={() => router.push("/pricing")}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            App Policy
          </button>
        </div>
      </div>
    </div>
  );
}

