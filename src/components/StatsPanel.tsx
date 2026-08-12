import { Gauge, Target, Clock, AlertCircle, Hash } from "lucide-react";
import { StatChip, accuracyColor } from "@/components/StatChip";
import type { TestMode } from "@/lib/storage";

interface Props {
  wpm: number;
  accuracy: number;
  seconds: number;
  errors: number;
  progress: number;
  mode: TestMode;
  timeRemaining: number | null;
  wordsCompleted: number;
  wordTarget?: number;
}

export function StatsPanel({
  wpm,
  accuracy,
  seconds,
  errors,
  progress,
  mode,
  timeRemaining,
  wordsCompleted,
  wordTarget,
}: Props) {
  const timeValue =
    (mode === "time" || mode === "custom") && timeRemaining !== null
      ? `${timeRemaining}s`
      : `${seconds}s`;
  const timeLabel = mode === "time" || mode === "custom" ? "restante" : "tiempo";

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
        {mode === "words" && wordTarget ? (
          <StatChip
            icon={Hash}
            label="palabras"
            value={`${wordsCompleted}/${wordTarget}`}
            size="sm"
            valueClassName="text-primary"
          />
        ) : (
          <StatChip
            icon={Clock}
            label={timeLabel}
            value={timeValue}
            size="sm"
            valueClassName={
              (mode === "time" || mode === "custom") &&
              timeRemaining !== null &&
              timeRemaining <= 5
                ? "text-destructive"
                : "text-primary"
            }
          />
        )}
        <StatChip icon={AlertCircle} label="errores" value={String(errors)} size="sm" valueClassName="text-primary" />
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {mode === "custom" && wordTarget ? (
        <p className="mt-2 text-center font-mono text-xs text-muted-foreground">
          {wordsCompleted}/{wordTarget} palabras completadas
        </p>
      ) : null}
    </div>
  );
}
