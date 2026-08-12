import type { TestConfig, TestMode, TimeOption, WordsOption } from "@/lib/storage";
import { TIME_OPTIONS, WORD_OPTIONS } from "@/lib/storage";

interface Props {
  config: TestConfig;
  onChange: (config: TestConfig) => void;
  disabled?: boolean;
}

function chipClass(active: boolean, disabled?: boolean) {
  return [
    "cursor-pointer rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-200 ease-out",
    disabled ? "pointer-events-none opacity-50" : "",
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-foreground/55 hover:bg-secondary/50 hover:text-foreground/85",
  ]
    .filter(Boolean)
    .join(" ");
}

export function TestConfigSelector({ config, onChange, disabled }: Props) {
  const setMode = (mode: TestMode) => onChange({ ...config, mode });

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <div className="flex rounded-full border border-border bg-card/60 p-1">
        {(["time", "words"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            disabled={disabled}
            onClick={() => setMode(mode)}
            className={[
              "cursor-pointer rounded-full px-5 py-2 font-mono text-xs capitalize transition-all duration-200 ease-out",
              disabled ? "pointer-events-none opacity-50" : "",
              config.mode === mode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/55 hover:bg-secondary/50 hover:text-foreground/85",
            ].join(" ")}
          >
            {mode === "time" ? "tiempo" : "palabras"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {config.mode === "time"
          ? TIME_OPTIONS.map((sec) => (
              <button
                key={sec}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...config, timeSeconds: sec as TimeOption })}
                className={chipClass(config.timeSeconds === sec, disabled)}
              >
                {sec}s
              </button>
            ))
          : WORD_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...config, wordCount: count as WordsOption })}
                className={chipClass(config.wordCount === count, disabled)}
              >
                {count}
              </button>
            ))}
      </div>
    </div>
  );
}
