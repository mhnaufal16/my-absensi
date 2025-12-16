import clsx from "clsx";
import { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border border-gray-200 shadow-sm p-6",
        "text-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}
