import type { Metadata } from "next";
import { BombApp } from "@/games/bomb/components/BombApp";
import { categories } from "@/games/bomb/data";

export const metadata: Metadata = {
  title: "Bomb",
  description: "Pass-the-phone party game. Don't be holding it when it blows.",
};

// Server component: reads the topic file at build time and hands it to the
// client app. No database, no API calls.
export default function BombPage() {
  return <BombApp categories={categories} />;
}
