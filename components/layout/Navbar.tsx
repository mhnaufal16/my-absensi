"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const router = useRouter();

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
        h-16 flex items-center justify-between px-6
        border-b border-[var(--border)]
        bg-[var(--background)]
        sticky top-0 z-10
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold text-[var(--foreground)]">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Sistem Absensi Kamera & GPS</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--foreground)]">Naufal</p>
          <p className="text-xs text-[var(--muted)]">Karyawan</p>
        </div>

        {/* Avatar */}
        <div
          className="
            w-9 h-9 rounded-full
            bg-emerald-600
            flex items-center justify-center
            text-white font-semibold
          "
        >
          N
        </div>

        <div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
