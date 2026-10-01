import type { ButtonHTMLAttributes } from "react";

/** Square −/+ button for numeric steppers. */
export function StepButton({ children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className="cut-corners-sm flex size-14 items-center justify-center bg-cyan font-display text-3xl text-ink transition-transform active:scale-90 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
