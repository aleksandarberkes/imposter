import type { GroupId } from "@/games/imposter/lib/types";
import type { Language } from "@/lib/language";

/** Picker sections, in display order. */
export const groups: { id: GroupId; icon: string; name: Record<Language, string> }[] = [
  { id: "everyday", icon: "🏠", name: { en: "Everyday", sr: "Svakodnevica" } },
  { id: "geography", icon: "🌍", name: { en: "Geography", sr: "Geografija" } },
  { id: "entertainment", icon: "🎬", name: { en: "Entertainment", sr: "Zabava" } },
  { id: "games", icon: "🎮", name: { en: "Games", sr: "Igre" } },
  { id: "music", icon: "🎵", name: { en: "Music", sr: "Muzika" } },
  { id: "sports", icon: "⚽", name: { en: "Sports", sr: "Sport" } },
];
