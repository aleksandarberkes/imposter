// Validates the Imposter category files in src/games/imposter/data/categories
// and the Bomb topics in src/games/bomb/data/categories.json.
// Usage: node scripts/validate-words.mjs [--min N]
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "src/games/imposter/data/categories");
const GROUPS = new Set(["everyday", "geography", "games", "entertainment", "music", "sports"]);
const minArg = process.argv.indexOf("--min");
const MIN = minArg > -1 ? Number(process.argv[minArg + 1]) : 10;

let errors = 0;
const err = (f, m) => { errors++; console.error(`✗ ${f}: ${m}`); };
const norm = (s) => s.trim().toLowerCase();
const ids = new Set();

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  let c;
  try { c = JSON.parse(readFileSync(join(dir, file), "utf8")); }
  catch (e) { err(file, `invalid JSON: ${e.message}`); continue; }

  if (typeof c.id !== "string" || !/^[a-z0-9-]+$/.test(c.id)) err(file, "id must be kebab-case");
  if (c.id !== file.replace(/\.json$/, "")) err(file, `id "${c.id}" must match filename`);
  if (ids.has(c.id)) err(file, "duplicate id"); ids.add(c.id);
  if (!GROUPS.has(c.group)) err(file, `group "${c.group}" must be one of ${[...GROUPS].join(", ")}`);
  if (typeof c.icon !== "string" || c.icon.length === 0 || c.icon.length > 4) err(file, "icon must be one emoji");
  for (const l of ["en", "sr"]) if (!c.name?.[l]) err(file, `missing name.${l}`);
  if (!Array.isArray(c.words)) { err(file, "words must be an array"); continue; }
  if (c.words.length < MIN) err(file, `only ${c.words.length} words (min ${MIN})`);

  const seen = { en: new Set(), sr: new Set() };
  c.words.forEach((w, i) => {
    for (const l of ["en", "sr"]) {
      const e = w?.[l];
      if (!e?.word || !e?.hint) { err(file, `word #${i + 1} missing ${l}.word or ${l}.hint`); continue; }
      if (norm(e.hint) === norm(e.word)) err(file, `word #${i + 1} ${l}: hint equals word ("${e.word}")`);
      if (norm(e.hint).includes(norm(e.word)) || norm(e.word).includes(norm(e.hint)))
        err(file, `word #${i + 1} ${l}: hint "${e.hint}" contains the word "${e.word}"`);
      if (seen[l].has(norm(e.word))) err(file, `duplicate ${l} word "${e.word}"`);
      seen[l].add(norm(e.word));
    }
  });
  if (!errors) console.log(`✓ ${file} (${c.words.length} words, ${c.group})`);
  else console.log(`  ${file}: ${c.words.length} words`);
}

// Bomb topics: [{ id, icon, name: {en, sr}, prompts: [{ en, sr }] }]
{
  const file = "bomb/categories.json";
  try {
    const list = JSON.parse(readFileSync(join(process.cwd(), "src/games/bomb/data/categories.json"), "utf8"));
    if (!Array.isArray(list)) err(file, "must be an array");
    else {
      const bombIds = new Set();
      const seen = { en: new Set(), sr: new Set() };
      let total = 0;
      for (const c of list) {
        const where = `${file} [${c?.id}]`;
        if (typeof c?.id !== "string" || !/^[a-z0-9-]+$/.test(c.id)) err(where, "id must be kebab-case");
        if (bombIds.has(c?.id)) err(where, "duplicate id"); bombIds.add(c?.id);
        if (typeof c?.icon !== "string" || c.icon.length === 0 || c.icon.length > 4) err(where, "icon must be one emoji");
        for (const l of ["en", "sr"]) if (!c?.name?.[l]) err(where, `missing name.${l}`);
        if (!Array.isArray(c?.prompts) || c.prompts.length === 0) { err(where, "prompts must be a non-empty array"); continue; }
        c.prompts.forEach((p, i) => {
          for (const l of ["en", "sr"]) {
            if (typeof p?.[l] !== "string" || !p[l].trim()) { err(where, `prompt #${i + 1} missing ${l}`); continue; }
            if (seen[l].has(norm(p[l]))) err(where, `duplicate ${l} prompt "${p[l]}"`);
            seen[l].add(norm(p[l]));
          }
        });
        total += c.prompts.length;
      }
      if (!errors) console.log(`✓ ${file} (${list.length} categories, ${total} topics)`);
    }
  } catch (e) { err(file, `invalid JSON: ${e.message}`); }
}

console.log(errors ? `\n${errors} error(s)` : "\nAll word files valid.");
process.exit(errors ? 1 : 0);
