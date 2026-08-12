import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SessionRecord } from "@/lib/storage";

interface Props {
  history: SessionRecord[];
  personalBest: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function modeLabel(session: SessionRecord): string {
  if (session.mode === "time") return `${session.amount}s`;
  if (session.mode === "words") return `${session.amount} pal.`;
  return `${session.amount}s · ${session.customWordCount ?? "?"} pal.`;
}

export function HistoryPanel({ history, personalBest }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Historial de sesiones"
          aria-label="Ver historial de sesiones"
          className="cursor-pointer rounded-full border border-border bg-card/60 p-2 text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
        >
          <History className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
            historial
          </DialogTitle>
        </DialogHeader>

        {personalBest > 0 && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              récord personal
            </p>
            <p className="font-mono text-3xl font-semibold tabular-nums text-primary">
              {personalBest} <span className="text-base font-normal text-muted-foreground">ppm</span>
            </p>
          </div>
        )}

        {history.length === 0 ? (
          <p className="py-6 text-center font-mono text-sm text-muted-foreground">
            Aún no hay sesiones guardadas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-3 font-normal uppercase tracking-wider">fecha</th>
                  <th className="pb-2 pr-3 font-normal uppercase tracking-wider">modo</th>
                  <th className="pb-2 pr-3 font-normal uppercase tracking-wider">ppm</th>
                  <th className="pb-2 font-normal uppercase tracking-wider">prec.</th>
                </tr>
              </thead>
              <tbody>
                {history.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 text-foreground">
                    <td className="py-2.5 pr-3 tabular-nums text-muted-foreground">
                      {formatDate(s.timestamp)}
                    </td>
                    <td className="py-2.5 pr-3">{modeLabel(s)}</td>
                    <td className="py-2.5 pr-3 tabular-nums text-primary">{s.wpm}</td>
                    <td className="py-2.5 tabular-nums">{s.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
