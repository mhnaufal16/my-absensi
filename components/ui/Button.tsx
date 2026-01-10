"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "relative overflow-hidden px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        "font-display tracking-tight flex items-center justify-center gap-2 outline-none",
        {
          // PRIMARY: Gradient Indigo with Glow
          "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:shadow-inner":
            variant === "primary",

          // SECONDARY: Clean Slate/Glass
          "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm":
            variant === "secondary",

          // DANGER: Elegant Rose
          "bg-rose-500 text-white shadow-lg shadow-rose-100 hover:bg-rose-600 hover:scale-[1.02]":
            variant === "danger",
        },
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
