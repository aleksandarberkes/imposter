type Props = {
  /** Headline, e.g. "All categories" or "3/9 selected". */
  summary: string;
  /** Small line under it, e.g. "120 words". */
  detail: string;
  /** Icons of the chosen categories; only the first few are shown. */
  icons: string[];
  pickLabel: string;
  onOpen: () => void;
};

/** Setup row that summarizes the chosen categories and opens the picker. */
export function CategoryField({ summary, detail, icons, pickLabel, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
    >
      <span className="min-w-0">
        <span className="block font-display text-lg leading-tight text-fg">{summary}</span>
        <span className="mt-1 block truncate font-mono text-[11px] uppercase tracking-widest text-muted">
          {detail} · {icons.slice(0, 6).join(" ")}
          {icons.length > 6 ? " …" : ""}
        </span>
      </span>
      <span className="cut-corners-sm shrink-0 bg-yellow px-3 py-2 font-display text-sm text-ink">
        {pickLabel} ›
      </span>
    </button>
  );
}
