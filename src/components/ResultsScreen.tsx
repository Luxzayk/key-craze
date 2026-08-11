import { Gauge, Target, Clock, AlertCircle } from "lucide-react";
import { StatChip, accuracyColor } from "@/components/StatChip";
import { WpmChart } from "@/components/WpmChart";
import { ErrorKeysList } from "@/components/ErrorKeysList";
import type { WpmSample } from "@/hooks/useTyping";

interface Props {
  wpm: number;
  accuracy: number;
  seconds: number;
  errors: number;
  wpmHistory: WpmSample[];
  errorKeys: Record<string, number>;
  onRetry: () => void;
  onNew: () => void;
}

export function ResultsScreen({
  wpm,
  accuracy,
  seconds,
  errors,
  wpmHistory,
  errorKeys,
  onRetry,
  onNew,
}: Props) {
  return (
    <div className="results-enter mb-4 w-full rounded-2xl border border-primary/30 bg-card/80 p-8 text-center shadow-[0_0_60px_-20px_var(--primary)] backdrop-blur">
      <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-primary">completado</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <StatChip icon={Gauge} label="ppm" value={String(wpm)} />
        <StatChip
          icon={Target}
          label="precisión"
          value={`${accuracy}%`}
          valueClassName={accuracyColor(accuracy)}
        />
        <StatChip icon={Clock} label="tiempo" value={`${seconds}s`} />
        <StatChip icon={AlertCircle} label="errores" value={String(errors)} />
      </div>

      <WpmChart data={wpmHistory} />
      <ErrorKeysList errorKeys={errorKeys} />

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRetry}
          className="cursor-pointer rounded-full bg-primary px-6 py-2.5 font-mono text-sm text-primary-foreground transition-all duration-150 hover:brightness-110 hover:shadow-[0_0_24px_-4px_var(--primary)] active:scale-95"
        >
          reintentar
        </button>
        <button
          onClick={onNew}
          className="cursor-pointer rounded-full border border-border px-6 py-2.5 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:border-primary/60 hover:text-primary"
        >
          nuevo texto
        </button>
      </div>
    </div>
  );
}
