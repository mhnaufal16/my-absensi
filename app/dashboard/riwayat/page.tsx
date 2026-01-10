"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function RiwayatDashboardPage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = getCookie("userId");
    const name = getCookie("userName");

    if (name) setUserName(decodeURIComponent(name));

    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/absensi?userId=${userId}&todayOnly=false`);
        const data = await res.json();
        if (data.success) {
          setAttendances(data.attendance || []);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Absensi</h1>
        <p className="text-sm text-gray-900">Daftar absensi terakhir Anda</p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memuat Riwayat...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow text-[var(--foreground)]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Waktu</th>
                <th className="px-4 py-2 text-left text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-gray-700">Detail Jam</th>
                <th className="px-4 py-2 text-left text-gray-700">Foto</th>
                <th className="px-4 py-2 text-right text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[var(--muted)]">Belum ada data absensi.</td>
                </tr>
              ) : attendances.map((a: any) => (
                <tr key={a.id} className="border-b last:border-none hover:bg-gray-50/50">
                  <td className="px-4 py-2 text-gray-700">
                    <div className="font-bold">{new Date(a.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{new Date(a.createdAt).getFullYear()}</div>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant={a.status === 'telat' ? 'danger' : a.status === 'pulang_dini' ? 'danger' : 'success'}>
                      {a.status ?? a.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Masuk: <span className="font-bold">{a.checkIn ? new Date(a.checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>Pulang: <span className="font-bold">{a.checkOut ? new Date(a.checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</span></span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <img src={a.photo} alt="foto" className="w-12 h-12 object-cover rounded-xl shadow-sm border border-slate-100" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="text-xs font-bold text-slate-900 mb-1">
                      {a.durationMinutes != null ? `${Math.floor(a.durationMinutes / 60)}j ${a.durationMinutes % 60}m` : '-'}
                    </div>
                    <Button variant="secondary" className="h-8 text-[10px] px-3">Detail</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
