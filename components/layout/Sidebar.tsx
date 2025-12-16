"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Badge from "@/components/ui/Badge";

const menus = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Absensi", href: "/dashboard/absensi", badge: "LIVE" },
  { name: "Riwayat", href: "/dashboard/riwayat" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-64 min-h-screen
        bg-[var(--background)]
        border-r border-[var(--border)]
        px-4 py-6
      "
    >
      {/* Brand */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[var(--foreground)]">
          MyAbsensi
        </h2>
        <p className="text-xs text-[var(--muted)]">
          Kamera & GPS
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={clsx(
                "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-[var(--foreground)] hover:bg-gray-100"
              )}
            >
              <span>{menu.name}</span>

              {menu.badge && <Badge>{menu.badge}</Badge>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
