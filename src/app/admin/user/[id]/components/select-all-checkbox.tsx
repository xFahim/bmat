/**
 * Select all checkbox component
 * Allows selecting/deselecting all pending annotations
 */

import { Checkbox } from "@/components/ui/checkbox";

interface SelectAllCheckboxProps {
  checked: boolean;
  pendingCount: number;
  onCheckedChange: (checked: boolean) => void;
}

export function SelectAllCheckbox({
  checked,
  pendingCount,
  onCheckedChange,
}: SelectAllCheckboxProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      <span className="text-sm text-muted-foreground">
        Select all pending annotations ({pendingCount})
      </span>
    </div>
  );
}


















