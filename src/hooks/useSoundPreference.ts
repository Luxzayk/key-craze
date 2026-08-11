import { useCallback, useState } from "react";

const STORAGE_KEY = "teclea-sound";

function readStored(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function useSoundPreference() {
  const [enabled, setEnabled] = useState(readStored);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { enabled, toggle };
}
