
import { GridPattern } from "@/components/ui/grid-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Highlighter } from "@/components/ui/highlighter";
import { HIGHLIGHTER_COLORS } from "@/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <Card className="relative overflow-hidden h-full border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
       <div className="absolute inset-0 z-0">
        <GridPattern className="force-dark opacity-20 mask-[linear-gradient(to_bottom,transparent_0%,transparent_10%,black_40%,black_60%,transparent_90%,transparent_100%)]" />
       </div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          🏆 Your Valuable Contribution
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-col justify-center gap-8 py-8">
        {/* Total Annotated */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-7xl font-bold tracking-tighter">
            <NumberTicker value={totalAnnotated} />
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            <Highlighter
              action="underline"
              color={HIGHLIGHTER_COLORS.YELLOW}
              strokeWidth={3}
            >
              Total Annotated
            </Highlighter>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4">
          {/* Pending Review */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold text-yellow-500">
              <NumberTicker value={pendingReview} />
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending</div>
          </div>

          {/* Approved */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl font-bold text-green-500">
              <NumberTicker value={approved} />
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Approved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


