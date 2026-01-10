"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const role = getCookie("userRole");
        if (role !== "ADMIN") {
            router.replace("/dashboard");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (e) {
            console.error(e);
        }
    };

    const adminMenus = [
        { name: "Overview", href: "/admin", icon: "📊" },
        { name: "Manajemen Admin", href: "/admin/administrasi", icon: "🛡️" },
        { name: "Data Karyawan", href: "/admin/karyawan", icon: "👥" },
        { name: "Riwayat Absensi", href: "/admin/absensi", icon: "📝" },
        { name: "Sistem & Settings", href: "/admin/pengaturan", icon: "⚙️" },
    ];

    if (!authorized) return null;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Premium Admin Sidebar */}
            <aside className="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-900">
                <div className="p-8 mb-10">
                    <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">🛡️</span>
                        <div className="flex flex-col">
                            <span className="leading-none">Admin</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Console v2.0</span>
                        </div>
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {adminMenus.map((menu) => (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={clsx(
                                "flex items-center gap-3 py-3 px-5 rounded-2xl transition-all duration-300 font-semibold text-sm",
                                pathname === menu.href
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                            )}
                        >
                            <span className="text-lg">{menu.icon}</span>
                            {menu.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-900">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-3 px-5 rounded-2xl transition-all duration-300 font-bold text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Keluar Aplikasi
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent)]">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
