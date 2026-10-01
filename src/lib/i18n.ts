import type { Language } from "./language";

// Strings shared by the main menu and all games. Game-specific strings live
// in src/games/<game>/lib/i18n.ts.
const dict = {
  en: {
    menuTitle: "PARTY GAMES",
    menuTagline: "Pick a game. Pass the phone.",
    play: "Play",
    players: "players",
    games: "Games",
    language: "Language",
    saved: "Settings are saved on this device.",
  },
  sr: {
    menuTitle: "IGRE ZA DRUŠTVO",
    menuTagline: "Izaberi igru. Dodaj telefon.",
    play: "Igraj",
    players: "igrača",
    games: "Igre",
    language: "Jezik",
    saved: "Podešavanja se čuvaju na ovom uređaju.",
  },
} satisfies Record<Language, Record<string, string>>;

export type CommonStrings = { [K in keyof (typeof dict)["en"]]: string };

export function tCommon(lang: Language): CommonStrings {
  return dict[lang];
}
