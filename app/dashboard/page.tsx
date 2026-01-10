import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const stats = [
    { label: "Total Hadir", value: "12", sub: "Karyawan hari ini", color: "from-emerald-500 to-teal-600", icon: "✨" },
    { label: "Terlambat", value: "02", sub: "Melewati jam masuk", color: "from-rose-500 to-pink-600", icon: "⏱️" },
    { label: "Belum Absen", value: "05", sub: "Menunggu laporan", color: "from-amber-400 to-orange-500", icon: "🔔" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">
          Selamat Datang, <span className="text-indigo-600">Naufal!</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">Berikut ringkasan kehadiran tim hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <Card key={i} className="relative overflow-hidden group hover:scale-[1.02] cursor-default border-none">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-5 -mr-10 -mt-10 rounded-full group-hover:opacity-10 transition-opacity`}></div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>Live Data</span>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-display font-bold text-slate-900 leading-tight">
                    {item.value}
                  </p>
                  <p className="text-xs font-medium text-slate-400 mb-2 truncate">{item.sub}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Placeholder for Recent Activity or Chart */}
      <Card className="p-0 overflow-hidden border-slate-100">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Aktivitas Terbaru</h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Lihat Semua</button>
        </div>
        <div className="p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            📊
          </div>
          <p className="text-sm text-slate-400 font-medium">Data grafik akan muncul di sini <br />setelah aktivitas harian terekam.</p>
        </div>
      </Card>
    </div>
  );
}
