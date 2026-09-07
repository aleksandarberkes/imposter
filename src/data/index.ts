// All word data lives in JSON files in ./categories. No database.
// Add a new file there and register it here.
import type { Category } from "@/lib/types";
import animals from "./categories/animals.json";
import food from "./categories/food.json";
import places from "./categories/places.json";

export const categories: Category[] = [animals, food, places] as Category[];
