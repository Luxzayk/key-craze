interface Props {
  wpm: number;
  accuracy: number;
  seconds: number;
  errors: number;
  progress: number;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-mono text-2xl font-semibold text-primary tabular-nums sm:text-3xl">
        {value}
      </span>
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function StatsPanel({ wpm, accuracy, seconds, errors, progress }: Props) {
  return (
    <div className="w-full rounded-2xl border border-border bg-card/50 p-4 backdrop-blur">
      <div className="grid grid-cols-4 gap-2">
        <Stat label="ppm" value={String(wpm)} />
        <Stat label="precisión" value={`${accuracy}%`} />
        <Stat label="tiempo" value={`${seconds}s`} />
        <Stat label="errores" value={String(errors)} />
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
