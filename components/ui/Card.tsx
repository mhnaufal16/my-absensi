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
        "bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 transition-all duration-300",
        "backdrop-blur-sm bg-white/90",
        className
      )}
    >
      {children}
    </div>
  );
}
