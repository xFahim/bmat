/**
 * Reusable stats card component
 */

import { NumberTicker } from "@/components/ui/number-ticker";

interface StatsCardProps {
  value: number;
  label: string;
  className?: string;
  valueClassName?: string;
}

export function StatsCard({
  value,
  label,
  className = "",
  valueClassName = "",
}: StatsCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className={`text-6xl font-bold ${valueClassName}`}>
        <NumberTicker value={value} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}



