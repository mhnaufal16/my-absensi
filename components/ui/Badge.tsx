import clsx from "clsx";
import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "danger";
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
        {
          "bg-indigo-50 text-indigo-700 border-indigo-100": variant === "default",
          "bg-emerald-50 text-emerald-700 border-emerald-100": variant === "success",
          "bg-rose-50 text-rose-700 border-rose-100": variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}
