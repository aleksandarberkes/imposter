// All word data lives in JSON files in ./categories. No database.
// Add a new file there and register it here (keep alphabetical).
import type { Category } from "@/games/imposter/lib/types";
import animals from "./categories/animals.json";
import anime from "./categories/anime.json";
import athletes from "./categories/athletes.json";
import boardGames from "./categories/board-games.json";
import brands from "./categories/brands.json";
import cities from "./categories/cities.json";
import countries from "./categories/countries.json";
import dnd from "./categories/dnd.json";
import drinks from "./categories/drinks.json";
import food from "./categories/food.json";
import hobbies from "./categories/hobbies.json";
import household from "./categories/household.json";
import landmarks from "./categories/landmarks.json";
import movies from "./categories/movies.json";
import mtg from "./categories/mtg.json";
import music from "./categories/music.json";
import musicians from "./categories/musicians.json";
import mythical from "./categories/mythical.json";
import nature from "./categories/nature.json";
import places from "./categories/places.json";
import pokemon from "./categories/pokemon.json";
import professions from "./categories/professions.json";
import sports from "./categories/sports.json";
import superheroes from "./categories/superheroes.json";
import tvSeries from "./categories/tv-series.json";
import videoGames from "./categories/video-games.json";

export const categories: Category[] = [
  animals,
  anime,
  athletes,
  boardGames,
  brands,
  cities,
  countries,
  dnd,
  drinks,
  food,
  hobbies,
  household,
  landmarks,
  movies,
  mtg,
  music,
  musicians,
  mythical,
  nature,
  places,
  pokemon,
  professions,
  sports,
  superheroes,
  tvSeries,
  videoGames,
] as Category[];
