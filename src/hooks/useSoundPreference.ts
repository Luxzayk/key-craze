import { useCallback, useState } from "react";
import { getSoundPref, saveSoundPref } from "@/lib/storage";

export function useSoundPreference() {
  const [enabled, setEnabled] = useState(() =>
    typeof window === "undefined" ? false : getSoundPref(),
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      saveSoundPref(next);
      return next;
    });
  }, []);

  return { enabled, toggle };
}
