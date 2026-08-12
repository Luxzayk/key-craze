import { useEffect, useState } from "react";
import { generateWords } from "@/lib/words";
import { wordCountOf } from "@/lib/typing-utils";
import type { TestConfig, TestMode, TimeOption, WordsOption } from "@/lib/storage";
import { TIME_OPTIONS, WORD_OPTIONS } from "@/lib/storage";

interface Props {
  config: TestConfig;
  onChange: (config: TestConfig) => void;
  onApplyCustomText?: (text: string) => void;
  disabled?: boolean;
}

const MODE_LABELS: Record<TestMode, string> = {
  time: "tiempo",
  words: "palabras",
  custom: "personalizado",
};

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

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function TestConfigSelector({ config, onChange, onApplyCustomText, disabled }: Props) {
  const [draft, setDraft] = useState(config.customText ?? "");

  useEffect(() => {
    setDraft(config.customText ?? "");
  }, [config.customText, config.mode]);

  const applyCustom = (raw: string) => {
    const normalized = normalizeText(raw);
    if (!normalized) return;
    const next = { ...config, customText: normalized };
    onChange(next);
    onApplyCustomText?.(normalized);
  };

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center rounded-full border border-border bg-card/60 p-1">
        {(["time", "words", "custom"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...config, mode })}
            className={[
              "cursor-pointer rounded-full px-4 py-2 font-mono text-xs capitalize transition-all duration-200 ease-out sm:px-5",
              disabled ? "pointer-events-none opacity-50" : "",
              config.mode === mode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground/55 hover:bg-secondary/50 hover:text-foreground/85",
            ].join(" ")}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      {config.mode === "custom" ? (
        <div className="w-full space-y-3 rounded-2xl border border-border bg-card/60 p-4">
          <div className="flex flex-wrap justify-center gap-2">
            {TIME_OPTIONS.map((sec) => (
              <button
                key={sec}
                type="button"
                disabled={disabled}
                onClick={() => onChange({ ...config, timeSeconds: sec as TimeOption })}
                className={chipClass(config.timeSeconds === sec, disabled)}
              >
                {sec}s
              </button>
            ))}
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={disabled}
            rows={4}
            placeholder="Escribe o pega tu texto personalizado…"
            className="w-full resize-none rounded-xl border border-border bg-background/60 p-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-50"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs text-muted-foreground">
              {wordCountOf(draft) > 0
                ? `${wordCountOf(draft)} ${wordCountOf(draft) === 1 ? "palabra" : "palabras"}`
                : "sin texto"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  const random = generateWords(30);
                  setDraft(random);
                  applyCustom(random);
                }}
                className="cursor-pointer rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                texto aleatorio
              </button>
              <button
                type="button"
                disabled={disabled || !normalizeText(draft)}
                onClick={() => applyCustom(draft)}
                className="cursor-pointer rounded-full bg-primary px-4 py-1.5 font-mono text-xs text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                usar texto
              </button>
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
