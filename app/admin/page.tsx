import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";

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
    const late = todayAttendance.filter(a => a.status === 'telat').length;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
                <p className="text-gray-600">Statistik kehadiran hari ini ({now.toLocaleDateString()})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-500 uppercase">Total Karyawan</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{totalKaryawan}</p>
                </Card>

                <Card className="bg-white border-l-4 border-green-500">
                    <p className="text-sm font-medium text-gray-500 uppercase">Hadir Hari Ini</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{checkedIn}</p>
                </Card>

                <Card className="bg-white border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500 uppercase">Terlambat</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{late}</p>
                </Card>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 italic text-gray-400">Activity monitor coming soon...</h2>
                <div className="h-40 bg-gray-50 rounded flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                    Visualisasi data grafik akan tampil di sini
                </div>
            </div>
        </div>
    );
}
