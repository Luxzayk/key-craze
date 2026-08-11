import { useCallback, useEffect, useRef, useState } from "react";
import { playClickSound } from "@/lib/click-sound";

/** Si es true, el usuario no puede avanzar hasta corregir el error. */
export const STRICT_MODE = true;

export interface WpmSample {
  t: number;
  wpm: number;
}

export interface TypingState {
  typed: string;
  errors: number;
  totalKeystrokes: number;
  startedAt: number | null;
  finished: boolean;
  elapsed: number;
  activeCode: string | null;
  activeError: boolean;
  blocked: boolean;
}

interface Options {
  soundEnabled?: boolean;
}

function calcWpm(typed: string, text: string, elapsedSec: number): number {
  if (elapsedSec <= 0) return 0;
  const correctChars = typed.split("").filter((c, i) => c === text[i]).length;
  return Math.round(correctChars / 5 / (elapsedSec / 60));
}

export function useTyping(text: string, options: Options = {}) {
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeError, setActiveError] = useState(false);
  const blockedRef = useRef(false);
  const [blocked, setBlocked] = useState(false);
  const [wpmHistory, setWpmHistory] = useState<WpmSample[]>([]);
  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});

  const typedRef = useRef(typed);
  typedRef.current = typed;
  const textRef = useRef(text);
  textRef.current = text;
  const soundRef = useRef(options.soundEnabled ?? false);
  soundRef.current = options.soundEnabled ?? false;

  const recordErrorKey = useCallback((code: string) => {
    setErrorKeys((prev) => ({ ...prev, [code]: (prev[code] ?? 0) + 1 }));
  }, []);

  const reset = useCallback(() => {
    setTyped("");
    setErrors(0);
    setTotalKeystrokes(0);
    setStartedAt(null);
    setFinished(false);
    setElapsed(0);
    setActiveCode(null);
    setActiveError(false);
    blockedRef.current = false;
    setBlocked(false);
    setWpmHistory([]);
    setErrorKeys({});
  }, []);

  useEffect(() => {
    reset();
  }, [text, reset]);

  useEffect(() => {
    if (startedAt === null || finished) return;
    const id = window.setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);

  useEffect(() => {
    if (startedAt === null || finished) return;
    const id = window.setInterval(() => {
      const elapsedSec = (Date.now() - startedAt) / 1000;
      if (elapsedSec < 0.5) return;
      const wpm = calcWpm(typedRef.current, textRef.current, elapsedSec);
      setWpmHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && Math.round(elapsedSec) - last.t < 1) return prev;
        return [...prev, { t: Math.round(elapsedSec), wpm }];
      });
    }, 1500);
    return () => window.clearInterval(id);
  }, [startedAt, finished]);

  useEffect(() => {
    const clearTimer = { id: 0 };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;

      const isChar = e.key.length === 1;
      if (!isChar && e.key !== "Backspace") return;
      e.preventDefault();
      if (finished) return;

      if (soundRef.current) playClickSound();

      const code = e.code || e.key;
      setActiveCode(code);

      if (e.key === "Backspace") {
        setActiveError(false);
        blockedRef.current = false;
        setBlocked(false);
        setTyped((t) => t.slice(0, -1));
      } else {
        if (STRICT_MODE && blockedRef.current) {
          setActiveError(true);
          setTotalKeystrokes((n) => n + 1);
          setErrors((n) => n + 1);
          recordErrorKey(code);
        } else {
          setStartedAt((s) => s ?? Date.now());
          setTyped((t) => {
            if (t.length >= text.length) return t;
            const expected = text[t.length];
            const ok = e.key === expected;
            setTotalKeystrokes((n) => n + 1);
            if (!ok) {
              setErrors((n) => n + 1);
              setActiveError(true);
              recordErrorKey(code);
              if (STRICT_MODE) {
                blockedRef.current = true;
                setBlocked(true);
              }
            } else {
              setActiveError(false);
            }
            const next = t + e.key;
            if (next.length >= text.length) setFinished(true);
            return next;
          });
        }
      }

      window.clearTimeout(clearTimer.id);
      clearTimer.id = window.setTimeout(() => setActiveCode(null), 140);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(clearTimer.id);
    };
  }, [text, finished, recordErrorKey]);

  useEffect(() => {
    if (finished && startedAt !== null) {
      const finalElapsed = (Date.now() - startedAt) / 1000;
      setElapsed(finalElapsed);
      const finalWpm = calcWpm(typedRef.current, textRef.current, finalElapsed);
      setWpmHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last?.t === Math.round(finalElapsed)) {
          return prev.map((s, i) => (i === prev.length - 1 ? { t: s.t, wpm: finalWpm } : s));
        }
        return [...prev, { t: Math.round(finalElapsed), wpm: finalWpm }];
      });
    }
  }, [finished, startedAt]);

  const correctChars = typed.split("").filter((c, i) => c === text[i]).length;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const accuracy =
    totalKeystrokes > 0 ? Math.round((Math.max(totalKeystrokes - errors, 0) / totalKeystrokes) * 100) : 100;

  return {
    typed,
    errors,
    finished,
    elapsed,
    activeCode,
    activeError,
    blocked,
    wpm,
    accuracy,
    wpmHistory,
    errorKeys,
    reset,
    progress: text.length ? (typed.length / text.length) * 100 : 0,
  };
}
