import { KEYBOARD_ROWS } from "@/lib/keyboard";

export function codeToLabel(code: string): string {
  for (const row of KEYBOARD_ROWS) {
    const key = row.find((k) => k.code === code);
    if (key) return key.label;
  }
  return code;
}
