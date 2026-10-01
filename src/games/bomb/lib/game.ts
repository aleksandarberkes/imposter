import { FUSE_RANGES, type Category, type Game, type Settings, type Topic } from "./types";

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/** Every prompt of every category as one list; games store indexes into it. */
export function flattenTopics(categories: Category[]): Topic[] {
  return categories.flatMap((c) => c.prompts.map((p) => ({ ...p, categoryId: c.id })));
}

/** Indexes of the topics in the selected categories (empty selection = all). */
export function topicPool(topics: Topic[], selected: string[]): number[] {
  const all = topics.map((_, i) => i);
  if (selected.length === 0) return all;
  const picked = all.filter((i) => selected.includes(topics[i].categoryId));
  return picked.length > 0 ? picked : all;
}

/** Random topic from the pool that hasn't been played yet; starts over when all are used. */
function drawPrompt(pool: number[], used: number[]) {
  const usedSet = new Set(used);
  let free = pool.filter((i) => !usedSet.has(i));
  let nextUsed = used;
  if (free.length === 0) {
    free = pool;
    nextUsed = used.filter((i) => !pool.includes(i));
  }
  const promptIndex = free[randomInt(free.length)];
  return { promptIndex, used: [...nextUsed, promptIndex] };
}

export function createGame(settings: Settings, pool: number[]): Game {
  return {
    phase: "ready",
    round: 1,
    ...drawPrompt(pool, []),
    explodesAt: null,
    strikes: Array.from({ length: settings.players }, () => 0),
    loser: null,
  };
}

/** Swap the current prompt for another one before the bomb is armed. */
export function skipPrompt(game: Game, pool: number[]): Game {
  return { ...game, ...drawPrompt(pool, game.used) };
}

/** Start the hidden fuse. */
export function arm(game: Game, settings: Settings): Game {
  const [min, max] = FUSE_RANGES[settings.fuse];
  const seconds = min + Math.random() * (max - min);
  return { ...game, phase: "ticking", explodesAt: Date.now() + seconds * 1000 };
}

export function explode(game: Game): Game {
  return { ...game, phase: "exploded", explodesAt: null, loser: null };
}

/** Record who was holding the bomb when it went off. */
export function blame(game: Game, player: number): Game {
  const strikes = game.strikes.slice();
  strikes[player] = (strikes[player] ?? 0) + 1;
  return { ...game, strikes, loser: player };
}

export function nextRound(game: Game, pool: number[]): Game {
  return {
    ...game,
    phase: "ready",
    round: game.round + 1,
    ...drawPrompt(pool, game.used),
    explodesAt: null,
    loser: null,
  };
}
