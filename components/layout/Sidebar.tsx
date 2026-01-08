"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Badge from "@/components/ui/Badge";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

const menus = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Absensi", href: "/dashboard/absensi", badge: "LIVE" },
  { name: "Riwayat", href: "/dashboard/riwayat" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(getCookie("userRole") === "ADMIN");
  }, []);

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

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-[var(--border)]">
            <Link
              href="/admin"
              className="flex items-center px-3 py-2 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-all"
            >
              🛡️ Admin Panel
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
