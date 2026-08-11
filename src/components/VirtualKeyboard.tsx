import { KEYBOARD_ROWS } from "@/lib/keyboard";

interface Props {
  activeCode: string | null;
  activeError: boolean;
  nextChar?: string | undefined;
}

export function VirtualKeyboard({ activeCode, activeError, nextChar }: Props) {
  return (
    <div className="hidden w-full select-none flex-col gap-1.5 rounded-2xl border border-border bg-card/50 p-3 shadow-lg backdrop-blur md:flex">
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-1.5">
          {row.map((key) => {
            const active = activeCode === key.code;
            const hint =
              nextChar !== undefined &&
              (key.code === "Space"
                ? nextChar === " "
                : key.label.toLowerCase() === nextChar.toLowerCase());
            return (
              <div
                key={key.code}
                style={{ flexGrow: key.width ?? 1, flexBasis: 0 }}
                className={[
                  "flex h-10 items-center justify-center rounded-lg border font-mono text-xs sm:h-12 sm:text-sm",
                  "transition-all duration-150 ease-out",
                  active
                    ? activeError
                      ? "-translate-y-0.5 border-destructive bg-destructive/80 text-destructive-foreground shadow-[0_0_18px_var(--destructive)]"
                      : "-translate-y-0.5 border-primary bg-primary text-primary-foreground shadow-[0_0_18px_var(--primary)]"
                    : hint
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border bg-secondary/60 text-muted-foreground",
                ].join(" ")}
              >
                {key.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
