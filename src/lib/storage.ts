const PREFIX = "typingapp_";

export const STORAGE_KEYS = {
  streak: `${PREFIX}streak`,
  history: `${PREFIX}history`,
  fontPref: `${PREFIX}fontPref`,
  testConfig: `${PREFIX}testConfig`,
  sound: `${PREFIX}sound`,
} as const;

export type TestMode = "time" | "words";
export type TimeOption = 15 | 30 | 60 | 120;
export type WordsOption = 10 | 25 | 50 | 100;

export interface TestConfig {
  mode: TestMode;
  timeSeconds: TimeOption;
  wordCount: WordsOption;
}

export interface StreakData {
  count: number;
  lastDate: string;
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  mode: TestMode;
  amount: number;
  wpm: number;
  accuracy: number;
  errors: number;
}

export type FontId = "jetbrains" | "fira" | "source" | "ibm" | "system";

export const FONT_OPTIONS: { id: FontId; label: string; family: string; google?: string }[] = [
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    family: '"JetBrains Mono", ui-monospace, monospace',
    google: "JetBrains+Mono",
  },
  {
    id: "fira",
    label: "Fira Code",
    family: '"Fira Code", ui-monospace, monospace',
    google: "Fira+Code",
  },
  {
    id: "source",
    label: "Source Code Pro",
    family: '"Source Code Pro", ui-monospace, monospace',
    google: "Source+Code+Pro",
  },
  {
    id: "ibm",
    label: "IBM Plex Mono",
    family: '"IBM Plex Mono", ui-monospace, monospace',
    google: "IBM+Plex+Mono",
  },
  {
    id: "system",
    label: "Sistema",
    family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
];

export const TIME_OPTIONS: TimeOption[] = [15, 30, 60, 120];
export const WORD_OPTIONS: WordsOption[] = [10, 25, 50, 100];

const DEFAULT_TEST_CONFIG: TestConfig = {
  mode: "time",
  timeSeconds: 30,
  wordCount: 25,
};

const DEFAULT_STREAK: StreakData = { count: 0, lastDate: "" };

const MAX_HISTORY = 50;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isValidTestConfig(v: unknown): v is TestConfig {
  if (!v || typeof v !== "object") return false;
  const c = v as TestConfig;
  return (
    (c.mode === "time" || c.mode === "words") &&
    TIME_OPTIONS.includes(c.timeSeconds) &&
    WORD_OPTIONS.includes(c.wordCount)
  );
}

function isValidStreak(v: unknown): v is StreakData {
  if (!v || typeof v !== "object") return false;
  const s = v as StreakData;
  return typeof s.count === "number" && typeof s.lastDate === "string";
}

function isValidSession(v: unknown): v is SessionRecord {
  if (!v || typeof v !== "object") return false;
  const s = v as SessionRecord;
  return (
    typeof s.id === "string" &&
    typeof s.timestamp === "number" &&
    (s.mode === "time" || s.mode === "words") &&
    typeof s.amount === "number" &&
    typeof s.wpm === "number" &&
    typeof s.accuracy === "number" &&
    typeof s.errors === "number"
  );
}

export function getTestConfig(): TestConfig {
  const raw = readJson<unknown>(STORAGE_KEYS.testConfig, DEFAULT_TEST_CONFIG);
  return isValidTestConfig(raw) ? raw : DEFAULT_TEST_CONFIG;
}

export function saveTestConfig(config: TestConfig): void {
  writeJson(STORAGE_KEYS.testConfig, config);
}

export function getStreak(): StreakData {
  const raw = readJson<unknown>(STORAGE_KEYS.streak, DEFAULT_STREAK);
  return isValidStreak(raw) ? raw : DEFAULT_STREAK;
}

export function getEffectiveStreak(): StreakData {
  const data = getStreak();
  if (!data.lastDate) return { count: 0, lastDate: "" };
  const today = todayLocal();
  const yesterday = yesterdayLocal();
  if (data.lastDate === today || data.lastDate === yesterday) return data;
  return { count: 0, lastDate: data.lastDate };
}

/** Registra práctica de hoy y devuelve la racha actualizada. */
export function updateStreak(): StreakData {
  const today = todayLocal();
  const current = getStreak();

  if (current.lastDate === today) return current;

  const next: StreakData = {
    count: current.lastDate === yesterdayLocal() ? current.count + 1 : 1,
    lastDate: today,
  };

  writeJson(STORAGE_KEYS.streak, next);
  return next;
}

export function getHistory(): SessionRecord[] {
  const raw = readJson<unknown>(STORAGE_KEYS.history, []);
  if (!Array.isArray(raw)) return [];
  return raw.filter(isValidSession).sort((a, b) => b.timestamp - a.timestamp);
}

export function saveSession(record: Omit<SessionRecord, "id">): SessionRecord {
  const session: SessionRecord = {
    ...record,
    id: `${record.timestamp}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const history = getHistory();
  const next = [session, ...history].slice(0, MAX_HISTORY);
  writeJson(STORAGE_KEYS.history, next);
  return session;
}

export function getPersonalBest(): number {
  const history = getHistory();
  if (history.length === 0) return 0;
  return Math.max(...history.map((s) => s.wpm));
}

export function getFontPref(): FontId {
  if (!canUseStorage()) return "jetbrains";
  const raw = localStorage.getItem(STORAGE_KEYS.fontPref);
  if (raw && FONT_OPTIONS.some((f) => f.id === raw)) return raw as FontId;
  return "jetbrains";
}

export function saveFontPref(id: FontId): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.fontPref, id);
  } catch {
    /* ignore */
  }
}

export function getSoundPref(): boolean {
  if (!canUseStorage()) return false;
  const v = localStorage.getItem(STORAGE_KEYS.sound);
  if (v === "true" || v === "false") return v === "true";
  const legacy = localStorage.getItem("teclea-sound");
  return legacy === "true";
}

export function saveSoundPref(enabled: boolean): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.sound, String(enabled));
  } catch {
    /* ignore */
  }
}

export function fontFamilyFor(id: FontId): string {
  return FONT_OPTIONS.find((f) => f.id === id)?.family ?? FONT_OPTIONS[0].family;
}

export function googleFontsHref(): string {
  const families = FONT_OPTIONS.filter((f) => f.google)
    .map((f) => `family=${f.google}:wght@400;500;600`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
