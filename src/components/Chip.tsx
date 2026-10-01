type Props = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

/** Toggle chip for picking one option out of a few. */
export function Chip({ active, children, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cut-corners-sm min-h-11 px-4 font-mono text-sm font-bold uppercase tracking-wide transition-transform active:scale-95 ${
        active ? "bg-pink text-ink" : "bg-bg text-fg border border-fg/25"
      }`}
    >
      {children}
    </button>
  );
}
