import { FONT_OPTIONS, type FontId } from "@/lib/storage";

interface Props {
  fontId: FontId;
  onChange: (id: FontId) => void;
}

export function FontSelector({ fontId, onChange }: Props) {
  return (
    <select
      value={fontId}
      onChange={(e) => onChange(e.target.value as FontId)}
      title="Fuente de práctica"
      aria-label="Fuente monoespaciada para el texto de práctica"
      className="cursor-pointer rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground outline-none transition-colors hover:border-primary hover:text-primary focus:border-primary"
    >
      {FONT_OPTIONS.map((f) => (
        <option key={f.id} value={f.id}>
          {f.label}
        </option>
      ))}
    </select>
  );
}
