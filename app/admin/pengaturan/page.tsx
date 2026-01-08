"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function AdminSettingsPage() {
    const [jamMasuk, setJamMasuk] = useState("08:00");
    const [jamPulang, setJamPulang] = useState("17:00");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                const data = await res.json();
                const start = data.find((s: any) => s.key === 'workStartTime')?.value;
                const end = data.find((s: any) => s.key === 'workEndTime')?.value;
                if (start) setJamMasuk(start);
                if (end) setJamPulang(end);
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
                        workEndTime: jamPulang
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

    if (loading) return <p>Memuat pengaturan...</p>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
                <p className="text-gray-600">Konfigurasi jam kerja dan aturan absensi</p>
            </div>

            <div className="max-w-2xl">
                <Card className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Jam Kerja Global</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Jam Masuk</label>
                            <input
                                type="time"
                                value={jamMasuk}
                                onChange={e => setJamMasuk(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Jam Pulang</label>
                            <input
                                type="time"
                                value={jamPulang}
                                onChange={e => setJamPulang(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button variant="primary" onClick={handleSave} disabled={submitting}>
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </Card>

                <Card className="mt-8 bg-amber-50 border-amber-200">
                    <p className="text-sm text-amber-800">
                        <strong>Catatan:</strong> Perubahan jam kerja akan berpengaruh pada kalkulasi status (Telat/On Time) untuk absensi yang dilakukan setelah pengaturan disimpan.
                    </p>
                </Card>
            </div>
        </div>
    );
}
