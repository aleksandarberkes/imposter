import type { Language } from "@/lib/language";

export type Prompt = Record<Language, string>;

export type Category = {
  id: string;
  /** Single emoji shown next to the name. */
  icon: string;
  name: Record<Language, string>;
  prompts: Prompt[];
};

/** A prompt in the flat list the game indexes into. */
export type Topic = Prompt & { categoryId: string };

export type Fuse = "short" | "medium" | "long";

export type Settings = {
  players: number;
  /** Selected category ids. Empty array means "all". */
  categories: string[];
  fuse: Fuse;
  sound: boolean;
};

export type Phase = "ready" | "ticking" | "exploded";

export type Game = {
  phase: Phase;
  round: number;
  /** Index into the flat topic list for the current round. */
  promptIndex: number;
  /** Prompt indexes already played, so they don't repeat until all are used. */
  used: number[];
  /** Epoch ms when the bomb goes off. Stored so a refresh keeps the same fuse. */
  explodesAt: number | null;
  /** Explosions per player. */
  strikes: number[];
  /** Who was holding the bomb this round; null until picked. */
  loser: number | null;
};

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;

/** Hidden fuse length in seconds: [min, max]. */
export const FUSE_RANGES: Record<Fuse, [number, number]> = {
  short: [8, 20],
  medium: [15, 45],
  long: [30, 75],
};

export const DEFAULT_SETTINGS: Settings = {
  players: 4,
  categories: [],
  fuse: "medium",
  sound: true,
};
