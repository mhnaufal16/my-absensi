import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function RiwayatDashboardPage() {
  // Ambil data riwayat absensi dari database
  const attendances = await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Absensi</h1>
        <p className="text-2xl font-bold text-gray-800">Daftar absensi terakhir Anda</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-[var(--foreground)]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Waktu</th>
              <th className="px-4 py-2 text-left">Tipe</th>
              <th className="px-4 py-2 text-left">Lokasi</th>
              <th className="px-4 py-2 text-left">Foto</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[var(--muted)]">Belum ada data absensi.</td>
              </tr>
            ) : attendances.map((a) => (
              <tr key={a.id} className="border-b last:border-none hover:bg-gray-50/50">
                <td className="px-4 py-2">{a.user?.name ?? '-'}</td>
                <td className="px-4 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <Badge variant={a.type === 'IN' ? 'success' : 'default'}>
                    {a.type}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-xs">
                  <span className="block">Lat: {a.latitude}</span>
                  <span className="block">Lng: {a.longitude}</span>
                </td>
                <td className="px-4 py-2">
                  <img src={a.photo} alt="foto" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="px-4 py-2">
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
