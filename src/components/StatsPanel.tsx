import { Gauge, Target, Clock, AlertCircle } from "lucide-react";
import { StatChip, accuracyColor } from "@/components/StatChip";

interface Props {
  wpm: number;
  accuracy: number;
  seconds: number;
  errors: number;
  progress: number;
}

export function StatsPanel({ wpm, accuracy, seconds, errors, progress }: Props) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card/50 p-4 backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        <StatChip icon={Gauge} label="ppm" value={String(wpm)} size="sm" valueClassName="text-primary" />
        <StatChip
          icon={Target}
          label="precisión"
          value={`${accuracy}%`}
          size="sm"
          valueClassName={accuracyColor(accuracy)}
        />
        <StatChip icon={Clock} label="tiempo" value={`${seconds}s`} size="sm" valueClassName="text-primary" />
        <StatChip icon={AlertCircle} label="errores" value={String(errors)} size="sm" valueClassName="text-primary" />
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
