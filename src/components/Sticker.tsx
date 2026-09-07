type Props = {
  children: React.ReactNode;
  color?: "pink" | "cyan" | "yellow" | "lime";
  tilt?: number;
  className?: string;
};

const colors = {
  pink: "bg-pink text-ink",
  cyan: "bg-cyan text-ink",
  yellow: "bg-yellow text-ink",
  lime: "bg-lime text-ink",
};

/** Small rotated label, like a sticker slapped on a laptop. */
export function Sticker({ children, color = "yellow", tilt = -3, className = "" }: Props) {
  return (
    <span
      style={{ transform: `rotate(${tilt}deg)` }}
      className={`inline-block px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
