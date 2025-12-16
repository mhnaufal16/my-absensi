"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AbsensiPage() {
  // dummy state (nanti diganti real GPS & camera)
  const gpsValid = false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Absensi
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Lakukan absensi menggunakan kamera dan lokasi GPS
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kamera */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Kamera
          </h2>

          <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
            Kamera belum aktif
          </div>

          <p className="text-xs text-[var(--muted)] mt-3">
            Pastikan wajah terlihat jelas
          </p>
        </Card>

        {/* GPS */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">
            Lokasi GPS
          </h2>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Status Lokasi</span>

            {gpsValid ? (
              <Badge variant="success">Valid</Badge>
            ) : (
              <Badge variant="danger">Di luar area</Badge>
            )}
          </div>

          <div className="text-sm text-[var(--muted)] space-y-1">
            <p>Latitude: -7.56xxxx</p>
            <p>Longitude: 110.82xxxx</p>
            <p>Radius kantor: 100 meter</p>
          </div>
        </Card>
      </div>

      {/* Action */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Siap melakukan absensi?</p>
          <p className="text-sm text-[var(--muted)]">
            Absen hanya bisa dilakukan di area kantor
          </p>
        </div>

        <Button
          variant="primary"
          disabled={!gpsValid}
          className={!gpsValid ? "opacity-50 cursor-not-allowed" : ""}
        >
          Absen Sekarang
        </Button>
      </Card>
    </div>
  );
}
