"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CameraPreview from "@/components/absensi/CameraPreview";

const OFFICE_LOCATION = {
  lat: -7.565,
  lng: 110.816,
  radius: 100, // meter
};

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AbsensiPage() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [gpsValid, setGpsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS");
      setLoading(false);
      return;
    }

    const geoTimeout = setTimeout(() => {
      setLoading(false);
      alert("Mengambil lokasi terlalu lama. Pastikan GPS aktif dan izinkan akses lokasi.");
    }, 10000); // 10 detik timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(geoTimeout);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = getDistanceFromLatLonInMeters(
          userLat,
          userLng,
          OFFICE_LOCATION.lat,
          OFFICE_LOCATION.lng
        );
        setLat(userLat);
        setLng(userLng);
        setDistance(dist);
        setGpsValid(dist <= OFFICE_LOCATION.radius);
        setLoading(false);
        console.log('Lokasi berhasil:', userLat, userLng, dist);
      },
      (err) => {
        clearTimeout(geoTimeout);
        alert("Gagal mengambil lokasi: " + err.message);
        setLoading(false);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Absensi
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Absensi menggunakan kamera dan GPS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kamera */}
        <Card>
        <h2 className="text-lg font-semibold mb-4">Kamera</h2>

        <CameraPreview onCapture={(img) => setPhoto(img)} />

        {!photo && (
            <p className="text-xs text-[var(--muted)] mt-2">
            Pastikan wajah terlihat jelas
            </p>
        )}
        </Card>

        {/* GPS */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Lokasi GPS</h2>

          {loading ? (
            <p className="text-sm text-[var(--muted)]">
              Mengambil lokasi...
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Status Lokasi</span>
                {gpsValid ? (
                  <Badge variant="success">Valid</Badge>
                ) : (
                  <Badge variant="danger">Di luar area</Badge>
                )}
              </div>

              <div className="text-sm text-[var(--muted)] space-y-1">
                <p>Latitude: {lat}</p>
                <p>Longitude: {lng}</p>
                <p>Jarak ke kantor: {distance?.toFixed(2)} meter</p>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Action */}
      <Card className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Siap melakukan absensi?</p>
          <p className="text-sm text-[var(--muted)]">
            Lokasi harus berada dalam radius kantor
          </p>
        </div>

        <Button
        disabled={!gpsValid || !photo}
        className={!gpsValid || !photo ? "opacity-50 cursor-not-allowed" : ""}
        >
        Absen Sekarang
        </Button>
      </Card>
    </div>
  );
}
