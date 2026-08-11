import type { LengthKey } from "@/lib/words";

const OPTIONS: LengthKey[] = ["corto", "medio", "largo"];

interface Props {
  length: LengthKey;
  onLengthChange: (l: LengthKey) => void;
}

export function ModeTabs({ length, onLengthChange }: Props) {
  return (
    <div className="flex rounded-full border border-border bg-card/60 p-1">
      {OPTIONS.map((o) => (
        <button
          key={o}
          onClick={() => onLengthChange(o)}
          className={[
            "cursor-pointer rounded-full px-5 py-2 font-mono text-xs capitalize transition-all duration-200 ease-out",
            length === o
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/55 hover:bg-secondary/50 hover:text-foreground/85",
          ].join(" ")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
