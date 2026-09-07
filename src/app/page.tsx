import { App } from "@/components/App";
import { categories } from "@/data";

// Server component: reads the word files at build time and hands them to the
// client app. No database, no API calls.
export default function Home() {
  return <App categories={categories} />;
}
