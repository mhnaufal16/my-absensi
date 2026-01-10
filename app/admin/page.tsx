import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default async function AdminDashboard() {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const [totalKaryawan, todayAttendance] = await Promise.all([
        (prisma.user as any).count({ where: { role: "USER" } }),
        prisma.attendance.findMany({
            where: {
                createdAt: { gte: start, lt: end }
            }
        })
    ]);

    const checkedIn = todayAttendance.length;
    const late = todayAttendance.filter((a: any) => a.status === 'telat').length;

    const stats = [
        { label: "Total SDM", value: totalKaryawan, sub: "Karyawan Aktif", color: "from-indigo-600 to-indigo-700", icon: "👥" },
        { label: "Check-in Hari Ini", value: checkedIn, sub: "Telah hadir", color: "from-emerald-500 to-teal-600", icon: "✅" },
        { label: "Terlambat", value: late, sub: "Melewati jam masuk", color: "from-rose-500 to-pink-600", icon: "⏱️" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Admin Console</h1>
                    <p className="text-slate-500 font-medium mt-1">Pantau kehadiran dan kelola sumber daya manusia Anda.</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Status Server</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                        <span className="text-sm font-bold text-slate-700">Online & Sinkron</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((item, i) => (
                    <Card key={i} className="relative overflow-hidden group hover:scale-[1.02] cursor-default border-none">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-5 -mr-10 -mt-10 rounded-full group-hover:opacity-10 transition-opacity`}></div>

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl">{item.icon}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>Realtime</span>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-5xl font-display font-bold text-slate-900 leading-tight">
                                        {item.value}
                                    </p>
                                    <p className="text-xs font-medium text-slate-400 mb-2">{item.sub}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-0 overflow-hidden border-slate-100/50 shadow-premium">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-slate-800">Visualisasi Kehadiran</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Laporan Grafik Mingguan</p>
                    </div>
                    <Badge>Januari 2026</Badge>
                </div>
                <div className="p-16 text-center space-y-5">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            📊
                        </div>
                    </div>
                    <div className="max-w-xs mx-auto">
                        <p className="text-sm font-bold text-slate-700">Menyusun Data Laporan...</p>
                        <p className="text-xs text-slate-500 mt-2 font-medium">Analisis tren kehadiran akan muncul secara otomatis setelah data mencukupi.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
