// Bomb topics live in ./categories.json, grouped by category:
// [{ id, icon, name: {en, sr}, prompts: [{ en, sr }] }]. No database.
import type { Category } from "@/games/bomb/lib/types";
import data from "./categories.json";

export const categories: Category[] = data;
