import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default async function AdminAbsensiPage() {
    const attendances = await prisma.attendance.findMany({
        where: {
            user: {
                role: 'USER'
            }
        },
        orderBy: { createdAt: 'desc' },
        include: { user: true },
        take: 100
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Riwayat Absensi</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitoring dan audit seluruh log kehadiran secara realtime.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="bg-white">Ekspor CSV</Button>
                    <Button variant="secondary" className="bg-white">Unduh PDF</Button>
                </div>
            </div>

            <Card className="p-0 overflow-hidden border-none shadow-premium bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu & Tanggal</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karyawan</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Sesi</th>
                                <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Verifikasi</th>
                                <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lampiran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {attendances.map((a) => (
                                <tr key={a.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-700">{new Date(a.createdAt).toLocaleDateString()}</div>
                                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{new Date(a.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center font-bold text-sm border border-slate-100">
                                                {a.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-700">{a.user.name}</div>
                                                <div className="text-[10px] font-medium text-slate-400">{a.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="text-xs font-bold text-slate-600">IN: {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                <span className="text-xs font-bold text-slate-600">OUT: {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '-'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <Badge variant={a.status === 'telat' || a.status === 'pulang_dini' ? 'danger' : 'success'}>
                                            {a.status?.replace('_', ' ') || '-'}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-right">
                                        <div className="relative inline-block group/img">
                                            <img
                                                src={a.photo}
                                                alt="bukti"
                                                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover/img:scale-150 transition-transform cursor-zoom-in"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {attendances.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum Ada Riwayat Absensi</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
