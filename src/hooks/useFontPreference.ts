import { useCallback, useState } from "react";
import {
  fontFamilyFor,
  getFontPref,
  saveFontPref,
  type FontId,
} from "@/lib/storage";

export function useFontPreference() {
  const [fontId, setFontId] = useState<FontId>(() =>
    typeof window === "undefined" ? "jetbrains" : getFontPref(),
  );

  const setFont = useCallback((id: FontId) => {
    setFontId(id);
    saveFontPref(id);
  }, []);

  return { fontId, fontFamily: fontFamilyFor(fontId), setFont };
}
