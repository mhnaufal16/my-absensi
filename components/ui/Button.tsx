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
        "px-4 py-2 rounded-xl font-semibold text-sm",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          // PRIMARY
          "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600":
            variant === "primary",

          // SECONDARY
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400":
            variant === "secondary",

          // DANGER
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600":
            variant === "danger",
        },
        className
      )}
    >
      {children}
    </button>
  );
}
