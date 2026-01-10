"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AdminSettingsPage() {
    const [jamMasuk, setJamMasuk] = useState("08:00");
    const [jamPulang, setJamPulang] = useState("17:00");
    const [officeLatitude, setOfficeLatitude] = useState("-6.200000");
    const [officeLongitude, setOfficeLongitude] = useState("106.816666");
    const [officeRadius, setOfficeRadius] = useState("100");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                const start = data.find((s: any) => s.key === 'workStartTime')?.value;
                const end = data.find((s: any) => s.key === 'workEndTime')?.value;
                const lat = data.find((s: any) => s.key === 'officeLatitude')?.value;
                const lng = data.find((s: any) => s.key === 'officeLongitude')?.value;
                const rad = data.find((s: any) => s.key === 'officeRadius')?.value;

                if (start) setJamMasuk(start);
                if (end) setJamPulang(end);
                if (lat) setOfficeLatitude(lat);
                if (lng) setOfficeLongitude(lng);
                if (rad) setOfficeRadius(rad);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                body: JSON.stringify({
                    settings: {
                        workStartTime: jamMasuk,
                        workEndTime: jamPulang,
                        officeLatitude,
                        officeLongitude,
                        officeRadius
                    }
                }),
            });
            if (res.ok) {
                alert("Pengaturan berhasil disimpan");
            } else {
                alert("Gagal menyimpan pengaturan");
            }
        } catch (e) {
            alert("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h1>
                <p className="text-slate-500 font-medium mt-1">Konfigurasi parameter operasional dan kebijakan absensi global.</p>
            </div>

            <div className="max-w-3xl space-y-8">
                <Card className="p-8 border-none shadow-premium bg-white">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">🕒</div>
                        <div>
                            <h2 className="text-xl font-display font-bold text-slate-800">Jam Operasional</h2>
                            <p className="text-xs text-slate-500 font-medium">Tentukan batas waktu keterlambatan dan kepulangan.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                Jam Mandatori Masuk
                            </label>
                            <input
                                type="time"
                                value={jamMasuk}
                                onChange={e => setJamMasuk(e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-display font-bold text-slate-700"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Jam Selesai Kerja
                            </label>
                            <input
                                type="time"
                                value={jamPulang}
                                onChange={e => setJamPulang(e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-display font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-50">
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-50">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-rose-600 flex items-center justify-center text-xl">📍</div>
                            <div>
                                <h2 className="text-xl font-display font-bold text-slate-800">Geofencing & Lokasi</h2>
                                <p className="text-xs text-slate-500 font-medium">Tentukan titik koordinat kantor dan radius absensi yang diizinkan.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                    Latitude
                                </label>
                                <input
                                    type="text"
                                    value={officeLatitude}
                                    onChange={e => setOfficeLatitude(e.target.value)}
                                    placeholder="-6.200000"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-display font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                    Longitude
                                </label>
                                <input
                                    type="text"
                                    value={officeLongitude}
                                    onChange={e => setOfficeLongitude(e.target.value)}
                                    placeholder="106.816666"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-display font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Radius (Meter)
                                </label>
                                <input
                                    type="number"
                                    value={officeRadius}
                                    onChange={e => setOfficeRadius(e.target.value)}
                                    placeholder="100"
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-display font-bold text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={submitting}
                            className="w-full md:w-auto min-w-[200px]"
                        >
                            {submitting ? "Sinkronisasi..." : "Simpan Konfigurasi"}
                        </Button>
                    </div>
                </Card>

                <div className="p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 flex gap-4 items-start">
                    <span className="text-xl">💡</span>
                    <div>
                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Informasi Kebijakan</p>
                        <p className="text-sm text-indigo-700/80 leading-relaxed">
                            Perubahan konfigurasi jam kerja akan berlaku secara instan. Sistem akan mengalkulasi ulang status kehadiran berdasarkan parameter baru ini untuk sesi absensi berikutnya.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
