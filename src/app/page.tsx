export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        Imposter
      </h1>
      <p className="max-w-prose text-base text-muted sm:text-lg">
        Mobile-first Next.js starter. Edit{" "}
        <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">
          src/app/page.tsx
        </code>{" "}
        to get started.
      </p>
      <a
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-background transition active:scale-95 sm:min-h-12"
      >
        Read the docs
      </a>
    </main>
  );
}
