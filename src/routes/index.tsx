import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { generateWords } from "@/lib/words";
import { wordCountOf } from "@/lib/typing-utils";
import { useTyping } from "@/hooks/useTyping";
import { useSoundPreference } from "@/hooks/useSoundPreference";
import { useFontPreference } from "@/hooks/useFontPreference";
import {
  getEffectiveStreak,
  getHistory,
  getPersonalBest,
  getTestConfig,
  saveSession,
  saveTestConfig,
  updateStreak,
  type StreakData,
  type SessionRecord,
  type TestConfig,
} from "@/lib/storage";
import { TypingArea } from "@/components/TypingArea";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { StatsPanel } from "@/components/StatsPanel";
import { TextGenerator } from "@/components/TextGenerator";
import { ResultsScreen } from "@/components/ResultsScreen";
import { TestConfigSelector } from "@/components/TestConfigSelector";
import { StreakBadge } from "@/components/StreakBadge";
import { FontSelector } from "@/components/FontSelector";
import { HistoryPanel } from "@/components/HistoryPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Teclea — Práctica de mecanografía en español" },
      {
        name: "description",
        content:
          "Practica mecanografía en español con textos aleatorios, teclado virtual animado y métricas de PPM, precisión y errores en tiempo real.",
      },
      { property: "og:title", content: "Teclea — Práctica de mecanografía en español" },
      {
        property: "og:description",
        content:
          "Entrena tu velocidad de escritura con textos aleatorios en español, teclado virtual animado y estadísticas en vivo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function buildText(config: TestConfig): string {
  if (config.mode === "words") return generateWords(config.wordCount);
  if (config.mode === "custom") {
    const custom = normalizeText(config.customText ?? "");
    return custom || generateWords(30);
  }
  return generateWords(50);
}

function Index() {
  const [config, setConfig] = useState<TestConfig>(() => getTestConfig());
  const [sessionKey, setSessionKey] = useState(0);
  const [text, setText] = useState(() => buildText(getTestConfig()));
  const [dark, setDark] = useState(true);
  const [streak, setStreak] = useState<StreakData>(() => getEffectiveStreak());
  const [history, setHistory] = useState<SessionRecord[]>(() => getHistory());
  const [personalBest, setPersonalBest] = useState(() => getPersonalBest());
  const [isNewPB, setIsNewPB] = useState(false);

  const { enabled: soundEnabled, toggle: toggleSound } = useSoundPreference();
  const { fontId, fontFamily, setFont } = useFontPreference();
  const savedSessionRef = useRef<number | null>(null);

  const customWordCount = config.mode === "custom" ? wordCountOf(text) : undefined;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const extendText = useCallback(() => {
    setText((prev) => `${prev} ${generateWords(25)}`);
  }, []);

  const t = useTyping(text, sessionKey, {
    soundEnabled,
    mode: config.mode,
    timeLimitSec: config.mode === "time" || config.mode === "custom" ? config.timeSeconds : undefined,
    wordTarget:
      config.mode === "words"
        ? config.wordCount
        : config.mode === "custom" && customWordCount
          ? customWordCount
          : undefined,
    onExtendText: config.mode === "time" ? extendText : undefined,
  });

  const canChangeConfig = t.finished || t.typed.length === 0;

  const startNewSession = useCallback(
    (nextText?: string) => {
      setText(nextText ?? buildText(config));
      setSessionKey((k) => k + 1);
      setIsNewPB(false);
      savedSessionRef.current = null;
    },
    [config],
  );

  const handleConfigChange = useCallback(
    (next: TestConfig) => {
      if (!canChangeConfig) return;
      setConfig(next);
      saveTestConfig(next);
      if (next.mode === "custom") {
        const custom = normalizeText(next.customText ?? "");
        if (custom) startNewSession(custom);
        else {
          setText("");
          setSessionKey((k) => k + 1);
          setIsNewPB(false);
          savedSessionRef.current = null;
        }
        return;
      }
      startNewSession(buildText(next));
    },
    [canChangeConfig, startNewSession],
  );

  const handleApplyCustomText = useCallback(
    (customText: string) => {
      const normalized = normalizeText(customText);
      if (!normalized) return;
      const next = { ...config, mode: "custom" as const, customText: normalized };
      setConfig(next);
      saveTestConfig(next);
      startNewSession(normalized);
    },
    [config, startNewSession],
  );

  useEffect(() => {
    if (!t.finished) return;
    if (savedSessionRef.current === sessionKey) return;
    savedSessionRef.current = sessionKey;

    const pbBefore = getPersonalBest();
    const amount =
      config.mode === "words" ? config.wordCount : config.timeSeconds;

    saveSession({
      timestamp: Date.now(),
      mode: config.mode,
      amount,
      wpm: t.wpm,
      accuracy: t.accuracy,
      errors: t.errors,
      customWordCount: config.mode === "custom" ? customWordCount : undefined,
    });

    updateStreak();
    setStreak(getEffectiveStreak());
    const updatedHistory = getHistory();
    setHistory(updatedHistory);
    const pbAfter = getPersonalBest();
    setPersonalBest(pbAfter);
    setIsNewPB(t.wpm > pbBefore && t.wpm >= pbAfter);
  }, [t.finished, t.wpm, t.accuracy, t.errors, sessionKey, config, customWordCount]);

  const statusHint = (() => {
    if (t.blocked) return "corrige el error con ⌫ para continuar";
    if (config.mode === "time") return `modo tiempo · ${config.timeSeconds}s — empieza a escribir…`;
    if (config.mode === "words") return `modo palabras · ${config.wordCount} — empieza a escribir…`;
    return `modo personalizado · ${config.timeSeconds}s · ${customWordCount ?? 0} palabras — empieza a escribir…`;
  })();

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-8">
      <header className="mb-6 flex w-full max-w-4xl flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-lg font-semibold tracking-tight text-foreground">
          teclea<span className="text-primary">.</span>
        </h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <StreakBadge streak={streak} />
          <HistoryPanel history={history} personalBest={personalBest} />
          <FontSelector fontId={fontId} onChange={setFont} />
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
            aria-label={soundEnabled ? "Desactivar sonido de teclado" : "Activar sonido de teclado"}
            aria-pressed={soundEnabled}
            className={[
              "cursor-pointer rounded-full border border-border bg-card/60 p-2 transition-colors duration-150",
              soundEnabled
                ? "border-primary/50 text-primary"
                : "text-muted-foreground hover:border-primary hover:text-primary",
            ].join(" ")}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setDark((d) => !d)}
            className="cursor-pointer rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {dark ? "claro" : "oscuro"}
          </button>
        </div>
      </header>

      <div className="mb-8 flex w-full max-w-4xl justify-center">
        <TestConfigSelector
          config={config}
          onChange={handleConfigChange}
          onApplyCustomText={handleApplyCustomText}
          disabled={!canChangeConfig}
        />
      </div>

      <div
        className={`flex w-full max-w-4xl flex-col items-center ${t.finished ? "gap-10" : "gap-6"}`}
      >
        {t.finished ? (
          <ResultsScreen
            wpm={t.wpm}
            accuracy={t.accuracy}
            seconds={Math.round(t.elapsed)}
            errors={t.errors}
            wpmHistory={t.wpmHistory}
            errorKeys={t.errorKeys}
            isNewPB={isNewPB}
            onRetry={() => startNewSession()}
            onNew={() => startNewSession()}
          />
        ) : (
          <>
            {config.mode === "custom" && !customWordCount ? null : (
              <StatsPanel
                wpm={t.wpm}
                accuracy={t.accuracy}
                seconds={Math.round(t.elapsed)}
                errors={t.errors}
                progress={t.progress}
                mode={config.mode}
                timeRemaining={t.timeRemaining}
                wordsCompleted={t.wordsCompleted}
                wordTarget={
                  config.mode === "words"
                    ? config.wordCount
                    : config.mode === "custom"
                      ? customWordCount
                      : undefined
                }
              />
            )}
            {config.mode === "custom" && !customWordCount ? (
              <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-12">
                <p className="text-center font-mono text-sm text-muted-foreground">
                  escribe un texto arriba y pulsa «usar texto» para empezar
                </p>
              </div>
            ) : (
              <TypingArea
                text={text}
                typed={t.typed}
                errorAt={t.blocked}
                fontFamily={fontFamily}
              />
            )}
            {config.mode !== "custom" || customWordCount ? (
              <p className="font-mono text-xs text-muted-foreground">{statusHint}</p>
            ) : null}
          </>
        )}

        <TextGenerator mode={config.mode} onGenerate={() => startNewSession()} />

        <div className={t.finished ? "mt-2 w-full" : "w-full"}>
          <VirtualKeyboard
            activeCode={t.activeCode}
            activeError={t.activeError}
            nextChar={text[t.typed.length]}
            subdued={t.finished}
          />
        </div>
      </div>
    </main>
  );
}
