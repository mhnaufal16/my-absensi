import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default async function AdminAbsensiPage() {
    const attendances = await prisma.attendance.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        take: 100
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Riwayat Semua Absensi</h1>
                <p className="text-gray-600">Monitoring seluruh log kehadiran karyawan</p>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Jam</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{a.user.name}</div>
                                        <div className="text-xs text-gray-500">{a.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{new Date(a.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs font-semibold">{new Date(a.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-green-600 font-medium">In: {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-'}</span>
                                            <span className="text-blue-600 font-medium">Out: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={a.status === 'telat' || a.status === 'pulang_dini' ? 'danger' : 'success'}>
                                            {a.status?.toUpperCase() || '-'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={a.photo} alt="bukti" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
