import type { Category, Game, Settings } from "./types";

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function pickCategories(all: Category[], selected: string[]) {
  if (selected.length === 0) return all;
  const picked = all.filter((c) => selected.includes(c.id));
  return picked.length > 0 ? picked : all;
}

export function createGame(settings: Settings, all: Category[]): Game {
  const pool = pickCategories(all, settings.categories);
  // Weight by word count so every word is equally likely, not every category.
  const flat = pool.flatMap((c) =>
    c.words.map((w) => ({ categoryId: c.id, entry: w[settings.language] })),
  );
  const { categoryId, entry } = flat[randomInt(flat.length)];
  const n = settings.players;
  return {
    word: entry.word,
    hint: entry.hint,
    categoryId,
    imposterIndex: randomInt(n),
    cards: Array.from({ length: n }, () => "hidden"),
    tilts: Array.from({ length: n }, () => (Math.random() * 6 - 3)),
  };
}
