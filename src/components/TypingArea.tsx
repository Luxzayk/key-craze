import { useEffect, useRef } from "react";

interface Props {
  text: string;
  typed: string;
  errorAt: boolean;
  fontFamily: string;
}

export function TypingArea({ text, typed, errorAt, fontFamily }: Props) {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [typed.length]);

  return (
    <div className="relative w-full max-h-[40vh] overflow-y-auto rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-lg backdrop-blur">
      <p
        className="text-xl leading-relaxed tracking-wide sm:text-2xl sm:leading-[2.4rem] select-none"
        style={{ fontFamily }}
      >
        {text.split("").map((ch, i) => {
          const isTyped = i < typed.length;
          const correct = isTyped && typed[i] === ch;
          const current = i === typed.length;
          return (
            <span
              key={i}
              ref={current ? cursorRef : undefined}
              className={[
                "relative transition-colors duration-75",
                isTyped
                  ? correct
                    ? "text-success"
                    : "rounded-sm bg-destructive/20 text-destructive"
                  : "text-muted-foreground",
                current ? "caret-blink" : "",
                current && errorAt ? "text-destructive" : "",
              ].join(" ")}
            >
              {ch === " " && isTyped && !correct ? "␣" : ch}
            </span>
          );
        })}
      </p>
    </div>
  );
}
