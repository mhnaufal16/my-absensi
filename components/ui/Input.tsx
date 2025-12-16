"use client";

import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full px-4 py-2 rounded-xl",
        "border border-gray-300 bg-white",
        "text-gray-900 placeholder-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
        "transition-all duration-200",
        className
      )}
    />
  );
}
