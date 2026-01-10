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
        w-72 min-h-screen
        bg-slate-950
        border-r border-slate-900
        px-6 py-10 flex flex-col gap-10
      "
    >
      {/* Brand */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">M</span>
          MyAbsensi
        </h2>
        <p className="text-xs text-slate-500 font-medium px-1">
          Kamera & GPS System
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-2 flex-1">
        {menus.map((menu) => {
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={clsx(
                "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <span>{menu.name}</span>

              {menu.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-bold animate-pulse">
                  {menu.badge}
                </span>
              )}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-6 mt-6 border-t border-slate-900">
            <Link
              href="/admin"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                pathname.startsWith('/admin')
                  ? "bg-slate-800 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:text-indigo-400 hover:bg-slate-900"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></span>
              🛡️ Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Version or Support info */}
      <div className="px-2 pt-6 border-t border-slate-900">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Version 2.0 Premium</p>
      </div>
    </aside>
  );
}
