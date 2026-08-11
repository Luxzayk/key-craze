interface Props {
  wpm: number;
  accuracy: number;
  seconds: number;
  errors: number;
  onRetry: () => void;
  onNew: () => void;
}

export function ResultsScreen({ wpm, accuracy, seconds, errors, onRetry, onNew }: Props) {
  const items = [
    { label: "ppm", value: String(wpm) },
    { label: "precisión", value: `${accuracy}%` },
    { label: "tiempo", value: `${seconds}s` },
    { label: "errores", value: String(errors) },
  ];
  return (
    <div className="fade-up w-full rounded-2xl border border-primary/30 bg-card/80 p-8 text-center shadow-[0_0_60px_-20px_var(--primary)] backdrop-blur">
      <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-primary">completado</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col items-center gap-1">
            <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">
              {i.value}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              {i.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-full bg-primary px-6 py-2.5 font-mono text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          reintentar
        </button>
        <button
          onClick={onNew}
          className="rounded-full border border-border px-6 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          nuevo texto
        </button>
      </div>
    </div>
  );
}
