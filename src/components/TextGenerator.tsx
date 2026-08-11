import { useState } from "react";
import type { LengthKey } from "@/lib/words";

interface Props {
  length: LengthKey;
  onLengthChange: (l: LengthKey) => void;
  onGenerate: () => void;
  onCustomText: (t: string) => void;
}

const OPTIONS: LengthKey[] = ["corto", "medio", "largo"];

export function TextGenerator({ length, onLengthChange, onGenerate, onCustomText }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex rounded-full border border-border bg-card/60 p-1">
          {OPTIONS.map((o) => (
            <button
              key={o}
              onClick={() => onLengthChange(o)}
              className={[
                "rounded-full px-4 py-1.5 font-mono text-xs transition-colors duration-150",
                length === o
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {o}
            </button>
          ))}
        </div>
        <button
          onClick={onGenerate}
          className="rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
        >
          nuevo texto
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
        >
          texto propio
        </button>
      </div>

      {open && (
        <div className="space-y-2 rounded-2xl border border-border bg-card/60 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="Pega o escribe aquí tu texto personalizado…"
            className="w-full resize-none rounded-xl border border-border bg-background/60 p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDraft("")}
              className="rounded-full px-4 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              limpiar
            </button>
            <button
              onClick={() => {
                const t = draft.trim().replace(/\s+/g, " ");
                if (t) {
                  onCustomText(t);
                  setOpen(false);
                }
              }}
              className="rounded-full bg-primary px-4 py-1.5 font-mono text-xs text-primary-foreground transition-opacity hover:opacity-90"
            >
              practicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
