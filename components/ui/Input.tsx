"use client";

import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm",
        "text-slate-900 placeholder:text-slate-400 font-medium",
        "focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500",
        "transition-all duration-300",
        className
      )}
    />
  );
}
