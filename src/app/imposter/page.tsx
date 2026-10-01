import type { Metadata } from "next";
import { ImposterApp } from "@/games/imposter/components/ImposterApp";
import { categories } from "@/games/imposter/data";

export const metadata: Metadata = {
  title: "Imposter",
  description: "Pass-the-phone party game. One of you is lying.",
};

// Server component: reads the word files at build time and hands them to the
// client app. No database, no API calls.
export default function ImposterPage() {
  return <ImposterApp categories={categories} />;
}
