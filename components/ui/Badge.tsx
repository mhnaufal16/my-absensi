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
        "px-2 py-0.5 rounded-full text-xs font-semibold",
        {
          "bg-gray-200 text-gray-800": variant === "default",
          "bg-emerald-100 text-emerald-700": variant === "success",
          "bg-red-100 text-red-700": variant === "danger",
        }
      )}
    >
      {children}
    </span>
  );
}
