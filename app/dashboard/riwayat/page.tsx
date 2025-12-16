import { prisma } from "@/lib/prisma";

export default async function RiwayatDashboardPage() {
  // Ambil data riwayat absensi dari database
  const attendances = await prisma.attendance.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 20,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Riwayat Absensi</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Waktu</th>
              <th className="px-4 py-2">Tipe</th>
              <th className="px-4 py-2">Lokasi</th>
              <th className="px-4 py-2">Foto</th>
            </tr>
          </thead>
          <tbody>
            {attendances.map((a) => (
              <tr key={a.id}>
                <td className="border px-4 py-2">{a.user?.name ?? '-'}</td>
                <td className="border px-4 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="border px-4 py-2">{a.type}</td>
                <td className="border px-4 py-2">{a.latitude}, {a.longitude}</td>
                <td className="border px-4 py-2">
                  <img src={a.photo} alt="foto" className="w-12 h-12 object-cover rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
