import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
  size?: "sm" | "lg";
}

export function StatChip({ icon: Icon, label, value, valueClassName, size = "lg" }: Props) {
  const sizeClass = size === "sm" ? "text-2xl sm:text-3xl" : "text-4xl";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="h-4 w-4 stroke-[1.5] text-muted-foreground/70" aria-hidden />
      <span
        className={[
          "font-mono font-semibold tabular-nums text-foreground",
          sizeClass,
          valueClassName ?? "",
        ].join(" ")}
      >
        {value}
      </span>
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function accuracyColor(accuracy: number): string {
  if (accuracy > 95) return "text-success";
  if (accuracy >= 80) return "text-primary";
  return "text-destructive";
}
