import { codeToLabel } from "@/lib/key-label";

interface Props {
  errorKeys: Record<string, number>;
}

export function ErrorKeysList({ errorKeys }: Props) {
  const sorted = Object.entries(errorKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (sorted.length === 0) {
    return (
      <p className="mt-6 font-mono text-sm text-muted-foreground">Sin errores 🎉</p>
    );
  }

  return (
    <div className="mt-6 w-full text-left">
      <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        teclas con más errores
      </p>
      <ul className="flex flex-wrap justify-center gap-2">
        {sorted.map(([code, count]) => (
          <li
            key={code}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 font-mono text-xs"
          >
            <span className="min-w-[2ch] text-center text-foreground">{codeToLabel(code)}</span>
            <span className="text-destructive tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
