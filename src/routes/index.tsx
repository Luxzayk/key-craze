import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { generateText, type LengthKey } from "@/lib/words";
import { useTyping } from "@/hooks/useTyping";
import { TypingArea } from "@/components/TypingArea";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import { StatsPanel } from "@/components/StatsPanel";
import { TextGenerator } from "@/components/TextGenerator";
import { ResultsScreen } from "@/components/ResultsScreen";

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

function Index() {
  const [length, setLength] = useState<LengthKey>("corto");
  const [text, setText] = useState(() => generateText("corto"));
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const t = useTyping(text);

  const newText = useCallback(
    (l: LengthKey = length) => {
      setText(generateText(l));
    },
    [length],
  );

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-8">
      <header className="mb-8 flex w-full max-w-4xl items-center justify-between">
        <h1 className="font-mono text-lg font-semibold tracking-tight text-foreground">
          teclea<span className="text-primary">.</span>
        </h1>
        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {dark ? "claro" : "oscuro"}
        </button>
      </header>

      <div className="flex w-full max-w-4xl flex-col items-center gap-6">
        {t.finished ? (
          <ResultsScreen
            wpm={t.wpm}
            accuracy={t.accuracy}
            seconds={Math.round(t.elapsed)}
            errors={t.errors}
            onRetry={t.reset}
            onNew={() => newText()}
          />
        ) : (
          <>
            <StatsPanel
              wpm={t.wpm}
              accuracy={t.accuracy}
              seconds={Math.round(t.elapsed)}
              errors={t.errors}
              progress={t.progress}
            />
            <TypingArea text={text} typed={t.typed} errorAt={t.blocked} />
            <p className="font-mono text-xs text-muted-foreground">
              {t.blocked ? "corrige el error con ⌫ para continuar" : "empieza a escribir…"}
            </p>
          </>
        )}

        <TextGenerator
          length={length}
          onLengthChange={(l) => {
            setLength(l);
            newText(l);
          }}
          onGenerate={() => newText()}
          onCustomText={(txt) => setText(txt)}
        />

        <VirtualKeyboard
          activeCode={t.activeCode}
          activeError={t.activeError}
          nextChar={text[t.typed.length]}
        />
      </div>
    </main>
  );
}
