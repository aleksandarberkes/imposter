import { Sticker } from "./Sticker";

type Props = {
  label: string;
  color: "pink" | "cyan" | "yellow" | "lime";
  tilt: number;
  children: React.ReactNode;
};

/** Floating cut-corner box with a sticker label, used for setup sections. */
export function Panel({ label, color, tilt, children }: Props) {
  return (
    <section
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      className="relative animate-float-slow hard-shadow-ink"
    >
      <div className="cut-corners border-2 border-fg/15 bg-bg-2/90 p-4 pt-6">
        {children}
      </div>
      <Sticker color={color} tilt={-2} className="absolute -top-2 left-3">
        {label}
      </Sticker>
    </section>
  );
}
