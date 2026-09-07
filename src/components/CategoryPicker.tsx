"use client";

import { useEffect, useMemo } from "react";
import { Button } from "./Button";
import { Sticker } from "./Sticker";
import { groups } from "@/data/groups";
import { t } from "@/lib/i18n";
import type { Category, Language } from "@/lib/types";

type Props = {
  categories: Category[];
  /** Selected ids. Empty array means "all". */
  value: string[];
  language: Language;
  onChange: (next: string[]) => void;
  onClose: () => void;
};

/** Full-screen sheet for choosing categories, grouped by section. */
export function CategoryPicker({ categories, value, language, onChange, onClose }: Props) {
  const s = t(language);
  const allIds = useMemo(() => categories.map((c) => c.id), [categories]);
  const selected = useMemo(
    () => new Set(value.length === 0 ? allIds : value),
    [value, allIds],
  );
  const isAll = selected.size === allIds.length;
  const wordCount = categories
    .filter((c) => selected.has(c.id))
    .reduce((n, c) => n + c.words.length, 0);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const commit = (next: Set<string>) => {
    if (next.size === 0) return; // always keep at least one category
    onChange(next.size === allIds.length ? [] : allIds.filter((id) => next.has(id)));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    commit(next);
  };

  const toggleGroup = (ids: string[], allOn: boolean) => {
    const next = new Set(selected);
    ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
    commit(next);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex flex-col bg-bg/97 backdrop-blur-sm"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b-2 border-fg/10 px-4 py-3">
        <div>
          <h2 className="font-display text-xl leading-none text-fg">{s.categories}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
            {selected.size}/{allIds.length} {s.selected} · {wordCount} {s.words}
          </p>
        </div>
        <Button variant="cyan" onClick={onClose}>
          {s.done}
        </Button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <button
          type="button"
          aria-pressed={isAll}
          onClick={() => commit(new Set(allIds))}
          className={`cut-corners-sm mb-5 flex min-h-12 w-full items-center justify-between px-4 font-mono text-sm font-bold uppercase tracking-wide ${
            isAll ? "bg-pink text-ink" : "bg-bg-2 text-fg border border-fg/25"
          }`}
        >
          <span>✦ {s.allCategories}</span>
          <span className="opacity-70">{allIds.length}</span>
        </button>

        {groups.map((g) => {
          const items = categories.filter((c) => c.group === g.id);
          if (items.length === 0) return null;
          const ids = items.map((c) => c.id);
          const on = ids.filter((id) => selected.has(id)).length;
          const allOn = on === ids.length;
          return (
            <section key={g.id} className="mb-6 animate-slide-up">
              <div className="mb-2 flex items-center justify-between">
                <Sticker color={allOn ? "lime" : on > 0 ? "yellow" : "cyan"} tilt={-1.5}>
                  {g.icon} {g.name[language]} · {on}/{ids.length}
                </Sticker>
                <button
                  type="button"
                  onClick={() => toggleGroup(ids, allOn)}
                  className="min-h-9 px-2 font-mono text-[11px] uppercase tracking-widest text-muted underline-offset-4 active:underline"
                >
                  {allOn ? s.clear : s.selectAll}
                </button>
              </div>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {items.map((c) => {
                  const active = selected.has(c.id);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(c.id)}
                        className={`cut-corners-sm flex min-h-12 w-full items-center gap-3 px-3 text-left transition-transform active:scale-[0.98] ${
                          active
                            ? "bg-bg-2 border-2 border-cyan text-fg"
                            : "bg-bg border-2 border-fg/15 text-muted"
                        }`}
                      >
                        <span className="text-xl">{c.icon}</span>
                        <span className="flex-1 font-mono text-sm font-bold uppercase tracking-wide">
                          {c.name[language]}
                        </span>
                        <span className="font-mono text-[11px] opacity-60">{c.words.length}</span>
                        <span
                          aria-hidden
                          className={`flex size-6 items-center justify-center font-display text-sm ${
                            active ? "bg-cyan text-ink" : "border border-fg/25"
                          }`}
                        >
                          {active ? "✓" : ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 border-t-2 border-fg/10 bg-bg/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button size="lg" className="w-full" onClick={onClose}>
          ✓ {s.done} · {wordCount} {s.words}
        </Button>
      </footer>
    </div>
  );
}
