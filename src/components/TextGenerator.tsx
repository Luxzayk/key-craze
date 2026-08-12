import type { TestMode } from "@/lib/storage";

interface Props {
  mode: TestMode;
  onGenerate: () => void;
}

export function TextGenerator({ mode, onGenerate }: Props) {
  if (mode === "custom") return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={onGenerate}
        className="cursor-pointer rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary"
      >
        nuevo texto
      </button>
    </div>
  );
}
