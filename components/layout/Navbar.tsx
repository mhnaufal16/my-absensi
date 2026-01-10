"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState("Karyawan");

  useEffect(() => {
    const userRole = getCookie("userRole");
    if (userRole === "ADMIN") setRole("Admin");
    else setRole("Karyawan");
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      router.push("/login");
    }
  };

  return (
    <header
      className="
        h-20 flex items-center justify-between px-8
        border-b border-slate-100
        bg-white/80 backdrop-blur-md
        sticky top-0 z-10
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-xs text-slate-500 font-medium">Sistem Absensi Aktif</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">Naufal</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
              {role}
            </p>
          </div>

          {/* Avatar */}
          <div
            className="
              w-10 h-10 rounded-2xl
              bg-gradient-to-br from-indigo-500 to-violet-600
              flex items-center justify-center
              text-white font-bold shadow-lg shadow-indigo-100
            "
          >
            {role === "Admin" ? "A" : "U"}
          </div>
        </div>

        <div>
          <Button variant="secondary" onClick={handleLogout} className="border-none bg-slate-50 hover:bg-slate-100 text-slate-600 h-10 w-10 !p-0" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
