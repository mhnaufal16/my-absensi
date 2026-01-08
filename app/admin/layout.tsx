import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        🛡️ Admin Panel
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        📊 Overview
                    </Link>
                    <Link href="/admin/karyawan" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        👥 Data Karyawan
                    </Link>
                    <Link href="/admin/absensi" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        📝 Riwayat Semua
                    </Link>
                    <Link href="/admin/pengaturan" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800">
                        ⚙️ Pengaturan
                    </Link>
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <Link href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-800 text-indigo-300 text-sm">
                        ← Kembali ke User Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10">
                {children}
            </main>
        </div>
    );
}
