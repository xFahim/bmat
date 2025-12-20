/**
 * Reusable stats section component with grid pattern background
 */

import { GridPattern } from "@/components/ui/grid-pattern";
import { StatsCard } from "./stats-card";

interface Stat {
  value: number;
  label: string;
  valueClassName?: string;
}

interface StatsSectionProps {
  title?: string;
  stats: Stat[];
  className?: string;
}

export function StatsSection({
  title,
  stats,
  className = "",
}: StatsSectionProps) {
  return (
    <div className={`relative rounded-lg border border-zinc-800 overflow-hidden ${className}`}>
      <GridPattern className="absolute inset-0 fill-white/5 stroke-white/5" />
      <div className="relative p-8">
        {title && <h2 className="mb-8 text-2xl font-bold">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              value={stat.value}
              label={stat.label}
              valueClassName={stat.valueClassName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}



