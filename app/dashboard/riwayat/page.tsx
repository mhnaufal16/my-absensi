import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Attendance, User } from "@prisma/client";

type AttendanceWithUser = Attendance & { user?: User | null };

export default async function RiwayatDashboardPage() {
  // Ambil data riwayat absensi dari database
  const attendances = (await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 50,
  })) as AttendanceWithUser[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Absensi</h1>
        <p className="text-sm text-gray-900">Daftar absensi terakhir Anda</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-[var(--foreground)]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700">Nama</th>
              <th className="px-4 py-2 text-left text-gray-700">Waktu</th>
              <th className="px-4 py-2 text-left text-gray-700">Tipe</th>
              <th className="px-4 py-2 text-left text-gray-700">Lokasi</th>
              <th className="px-4 py-2 text-left text-gray-700">Foto</th>
              <th className="px-4 py-2 text-left text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--muted)]">Belum ada data absensi.</td>
              </tr>
            ) : attendances.map((a: AttendanceWithUser) => (
              <tr key={a.id} className="border-b last:border-none hover:bg-gray-50/50">
                <td className="px-4 py-2 text-gray-700">{a.user?.name ?? '-'}</td>
                <td className="px-4 py-2 text-gray-700">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <div>In: {a.checkIn ? new Date(a.checkIn).toLocaleString() : '-'}</div>
                  <div>Out: {a.checkOut ? new Date(a.checkOut).toLocaleString() : '-'}</div>
                </td>
                <td className="px-4 py-2">
                  <Badge variant={a.status === 'telat' ? 'danger' : a.status === 'pulang_dini' ? 'danger' : 'success'}>
                    {a.status ?? a.type}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-xs text-gray-600">
                  <span className="block">Lat: {a.latitude}</span>
                  <span className="block">Lng: {a.longitude}</span>
                </td>
                <td className="px-4 py-2">
                  <img src={a.photo} alt="foto" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm">Durasi: {a.durationMinutes != null ? `${Math.floor(a.durationMinutes/60)}j ${a.durationMinutes%60}m` : '-'}</div>
                  <Button variant="secondary">Detail</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
