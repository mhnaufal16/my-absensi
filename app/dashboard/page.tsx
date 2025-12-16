export default function DashboardPage() {
  const stats = [
    { label: "Hadir Hari Ini", value: 12, color: "text-green-600" },
    { label: "Telat", value: 2, color: "text-red-600" },
    { label: "Belum Absen", value: 5, color: "text-yellow-600" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm"
          >
            <p className="text-gray-500">{item.label}</p>
            <p className={`text-3xl font-bold ${item.color ?? ""}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
