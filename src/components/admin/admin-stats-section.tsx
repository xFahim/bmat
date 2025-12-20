/**
 * Admin stats section component
 */

import { StatsSection } from "@/components/shared";

interface AdminStatsSectionProps {
  totalRaw: number;
  totalDone: number;
  totalPending: number;
}

export function AdminStatsSection({
  totalRaw,
  totalDone,
  totalPending,
}: AdminStatsSectionProps) {
  const stats = [
    { value: totalRaw, label: "Total Raw Memes" },
    { value: totalDone, label: "Done" },
    { value: totalPending, label: "Pending" },
  ];

  return <StatsSection title="Overall Statistics" stats={stats} />;
}












