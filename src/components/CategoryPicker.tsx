"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { Sticker } from "./Sticker";

export type PickerItem = {
  id: string;
  icon: string;
  name: string;
  /** How many words/topics the category holds. */
  count: number;
};

export type PickerSection = {
  id: string;
  /** Section heading. Omit for a flat list without per-section select-all. */
  label?: string;
  items: PickerItem[];
};

export type PickerLabels = {
  title: string;
  selected: string;
  /** Unit for the counts, e.g. "words" or "topics". */
  unit: string;
  done: string;
  selectAll: string;
  deselectAll: string;
  /** Per-section "clear" link. */
  clear: string;
  /** Shown instead of Done while nothing is selected. */
  pickOne: string;
};

type Props = {
  sections: PickerSection[];
  /** Selected ids. Empty array means "all". */
  value: string[];
  labels: PickerLabels;
  onChange: (next: string[]) => void;
  onClose: () => void;
};

/** Full-screen sheet for choosing categories, optionally grouped by section. */
export function CategoryPicker({ sections, value, labels, onChange, onClose }: Props) {
  const items = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const allIds = useMemo(() => items.map((c) => c.id), [items]);
  // Local draft so the list can be emptied ("deselect all, then pick").
  // Only non-empty selections are saved; Done is disabled while it's empty.
  const [selected, setSelected] = useState(
    () => new Set(value.length === 0 ? allIds : value),
  );
  const isAll = selected.size === allIds.length;
  const isNone = selected.size === 0;
  const total = items.filter((c) => selected.has(c.id)).reduce((n, c) => n + c.count, 0);

  // Lock body scroll while the sheet is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const commit = (next: Set<string>) => {
    setSelected(next);
    if (next.size === 0) return; // never save an empty selection
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
          <h2 className="font-display text-xl leading-none text-fg">{labels.title}</h2>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
            {selected.size}/{allIds.length} {labels.selected} · {total} {labels.unit}
          </p>
        </div>
        <Button variant="cyan" onClick={onClose} disabled={isNone}>
          {labels.done}
        </Button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <div className="mb-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={isAll}
            onClick={() => commit(new Set(allIds))}
            className={`cut-corners-sm min-h-12 px-3 font-mono text-xs font-bold uppercase tracking-wide transition-transform active:scale-[0.98] ${
              isAll ? "bg-pink text-ink" : "bg-bg-2 text-fg border border-fg/25"
            }`}
          >
            ✦ {labels.selectAll}
          </button>
          <button
            type="button"
            aria-pressed={isNone}
            onClick={() => commit(new Set())}
            className={`cut-corners-sm min-h-12 px-3 font-mono text-xs font-bold uppercase tracking-wide transition-transform active:scale-[0.98] ${
              isNone ? "bg-yellow text-ink" : "bg-bg-2 text-fg border border-fg/25"
            }`}
          >
            ✕ {labels.deselectAll}
          </button>
        </div>

        {sections.map((g) => {
          if (g.items.length === 0) return null;
          const ids = g.items.map((c) => c.id);
          const on = ids.filter((id) => selected.has(id)).length;
          const allOn = on === ids.length;
          return (
            <section key={g.id} className="mb-6 animate-slide-up">
              {g.label && (
                <div className="mb-2 flex items-center justify-between">
                  <Sticker color={allOn ? "lime" : on > 0 ? "yellow" : "cyan"} tilt={-1.5}>
                    {g.label} · {on}/{ids.length}
                  </Sticker>
                  <button
                    type="button"
                    onClick={() => toggleGroup(ids, allOn)}
                    className="min-h-9 px-2 font-mono text-[11px] uppercase tracking-widest text-muted underline-offset-4 active:underline"
                  >
                    {allOn ? labels.clear : labels.selectAll}
                  </button>
                </div>
              )}
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {g.items.map((c) => {
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
                          {c.name}
                        </span>
                        <span className="font-mono text-[11px] opacity-60">{c.count}</span>
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
        <Button size="lg" className="w-full" onClick={onClose} disabled={isNone}>
          {isNone ? labels.pickOne : `✓ ${labels.done} · ${total} ${labels.unit}`}
        </Button>
      </footer>
    </div>
  );
}
