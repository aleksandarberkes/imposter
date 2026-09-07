export type Language = "en" | "sr";

export type LocalizedWord = { word: string; hint: string };

export type WordEntry = Record<Language, LocalizedWord>;

export type Category = {
  id: string;
  name: Record<Language, string>;
  words: WordEntry[];
};

export type Settings = {
  players: number;
  language: Language;
  /** Selected category ids. Empty array means "all". */
  categories: string[];
  hint: boolean;
};

export type CardState = "hidden" | "taken";

export type Game = {
  word: string;
  hint: string;
  categoryId: string;
  imposterIndex: number;
  cards: CardState[];
  /** Random small rotations per card so the layout looks hand-placed. */
  tilts: number[];
};

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;

export const DEFAULT_SETTINGS: Settings = {
  players: 4,
  language: "en",
  categories: [],
  hint: true,
};
