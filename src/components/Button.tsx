import type { ButtonHTMLAttributes } from "react";

type Variant = "pink" | "cyan" | "yellow" | "ghost";

const variants: Record<Variant, { btn: string; shadow: string }> = {
  pink: { btn: "bg-pink text-ink", shadow: "hard-shadow-cyan" },
  cyan: { btn: "bg-cyan text-ink", shadow: "hard-shadow-pink" },
  yellow: { btn: "bg-yellow text-ink", shadow: "hard-shadow-pink" },
  ghost: { btn: "bg-bg-2 text-fg border-2 border-fg/30", shadow: "hard-shadow-ink" },
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "md" | "lg";
};

export function Button({
  variant = "pink",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <span className={`press inline-flex ${variants[variant].shadow} ${className}`}>
      <button
        {...rest}
        className={[
          "w-full font-display uppercase tracking-wide select-none cut-corners-sm",
          "inline-flex items-center justify-center gap-2",
          "transition-transform duration-100 active:translate-x-[3px] active:translate-y-[3px]",
          "disabled:opacity-40 disabled:pointer-events-none",
          size === "lg" ? "min-h-14 px-8 text-lg" : "min-h-11 px-5 text-sm",
          variants[variant].btn,
        ].join(" ")}
      >
        {children}
      </button>
    </span>
  );
}
