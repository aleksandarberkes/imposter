import type { Language } from "@/lib/language";

// Registry of games shown on the main menu. Each game is fully self-contained
// in src/games/<id>/ (components, lib, data) with its route in src/app/<id>/.
// To add a game: create both folders and add an entry here.
export type GameInfo = {
  id: string;
  href: string;
  /** Single emoji shown on the menu card. */
  icon: string;
  color: "pink" | "cyan" | "yellow" | "lime";
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  minPlayers: number;
  maxPlayers: number;
};

export const games: GameInfo[] = [
  {
    id: "imposter",
    href: "/imposter",
    icon: "🕵️",
    color: "pink",
    name: { en: "IMPOSTER", sr: "IMPOSTOR" },
    tagline: { en: "One of you is lying.", sr: "Jedan od vas laže." },
    minPlayers: 3,
    maxPlayers: 12,
  },
  {
    id: "bomb",
    href: "/bomb",
    icon: "💣",
    color: "yellow",
    name: { en: "BOMB", sr: "BOMBA" },
    tagline: { en: "Don't be holding it when it blows.", sr: "Nemoj da ti pukne u rukama." },
    minPlayers: 2,
    maxPlayers: 12,
  },
];
