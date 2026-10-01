import Link from "next/link";

/** "← Games" style link back to the main menu. */
export function BackLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center font-mono text-sm text-muted underline-offset-4 hover:underline active:underline"
    >
      ← {children}
    </Link>
  );
}
