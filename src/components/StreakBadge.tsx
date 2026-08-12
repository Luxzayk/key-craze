import { Flame } from "lucide-react";
import type { StreakData } from "@/lib/storage";

interface Props {
  streak: StreakData;
}

function streakStyle(count: number): string {
  if (count >= 100) return "text-amber-300 streak-milestone-100";
  if (count >= 30) return "text-amber-400 streak-milestone-30";
  if (count >= 7) return "text-orange-400 streak-milestone-7";
  return "text-primary";
}

export function StreakBadge({ streak }: Props) {
  if (streak.count <= 0) return null;

  const label = streak.count === 1 ? "1 día" : `${streak.count} días`;

  return (
    <div
      className={[
        "flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-xs",
        streakStyle(streak.count),
      ].join(" ")}
      title="Racha diaria"
    >
      <Flame className={["h-4 w-4", streakStyle(streak.count)].join(" ")} aria-hidden />
      <span>{label}</span>
    </div>
  );
}
