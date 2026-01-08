"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CameraPreview from "@/components/absensi/CameraPreview";
import { OFFICE, RADIUS, getDistanceMeters } from "@/lib/office";

export default function AbsensiPage() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [gpsValid, setGpsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [today, setToday] = useState<any>(null);

  const submitAttendance = async () => {
    if (!photo || lat === null || lng === null || !gpsValid) {
      alert("Foto atau lokasi belum siap");
      return;
    }

    setSubmitting(true);
    try {
      console.log("Submitting attendance", { photo: !!photo, lat, lng });

      const action = (today?.checkIn && !today?.checkOut) ? "checkout" : "checkin";

      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // sementara (nanti dari session)
          photo,
          latitude: lat,
          longitude: lng,
          action,
          scheduledStart: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
          scheduledEnd: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        console.error("Response not JSON", e);
      }

      console.log("Attendance response", res.status, data);

      if (res.ok) {
        setMessage(`Absen ${action === 'checkin' ? 'masuk' : 'pulang'} berhasil`);
        setToday(data?.attendance);
        alert(`Absen ${action === 'checkin' ? 'masuk' : 'pulang'} berhasil`);
      } else {
        const msg = data?.message ?? `Gagal: status ${res.status}`;
        setMessage(msg);
        alert(msg);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal mengirim data. Cek console untuk detail.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    requestLocation();
    fetchTodayStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTodayStatus() {
    try {
      const res = await fetch("/api/absensi?userId=1");
      const data = await res.json();
      if (data.success) {
        setToday(data.attendance);
      }
    } catch (err) {
      console.error("Fetch today status error:", err);
    }
  }

  async function requestLocation() {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung GPS");
      setLoading(false);
      return;
    }

    try {
      // Check permission state if available
      if (navigator.permissions) {
        try {
          // PermissionName 'geolocation' may not be in TS union, cast it
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const perm = await navigator.permissions.query({ name: "geolocation" });
          if (perm.state === "denied") {
            setLocationError("Akses lokasi ditolak. Silakan izinkan lokasi pada browser.");
            setLoading(false);
            return;
          }
        } catch (e) {
          // ignore permission check failures and continue to prompt
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const dist = getDistanceMeters(userLat, userLng, OFFICE.lat, OFFICE.lng);

          setLat(userLat);
          setLng(userLng);
          setDistance(dist);
          setGpsValid(dist <= RADIUS);
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation error", err);
          if (err && typeof err.code !== "undefined") {
            // 1: PERMISSION_DENIED, 2: POSITION_UNAVAILABLE, 3: TIMEOUT
            if (err.code === 1) setLocationError("Akses lokasi ditolak oleh pengguna.");
            else if (err.code === 2) setLocationError("Posisi tidak tersedia.");
            else if (err.code === 3) setLocationError("Timeout saat mengambil lokasi.");
            else setLocationError("Gagal mengambil lokasi: " + (err.message || "unknown"));
          } else {
            setLocationError("Gagal mengambil lokasi.");
          }
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (error) {
      console.error("requestLocation error", error);
      setLocationError("Gagal meminta lokasi: " + String(error));
      setLoading(false);
    }
  }

  // Debug helpers: set sample coordinates to test radius logic
  const setSampleCoords = (latVal: number, lngVal: number) => {
    const dist = getDistanceMeters(latVal, lngVal, OFFICE.lat, OFFICE.lng);
    setLat(latVal);
    setLng(lngVal);
    setDistance(dist);
    setGpsValid(dist <= RADIUS);
    setMessage(`Menggunakan sample coords (jarak ${dist.toFixed(2)} m)`);
  };

  const resetToActual = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = getDistanceMeters(userLat, userLng, OFFICE.lat, OFFICE.lng);
        setLat(userLat);
        setLng(userLng);
        setDistance(dist);
        setGpsValid(dist <= RADIUS);
        setLoading(false);
        setMessage(null);
      },
      () => {
        alert("Gagal mengambil lokasi");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700 mb-1">Absensi</h1>
        <p className="text-sm text-gray-900">
          Absensi menggunakan kamera dan GPS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kamera */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Kamera</h2>
          <CameraPreview onCapture={setPhoto} />
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

              {lat === null ? (
                <div className="text-sm text-[var(--muted)]">
                  {locationError ? (
                    <>
                      <p className="text-red-600">{locationError}</p>
                      <div className="mt-2">
                        <Button variant="secondary" onClick={() => requestLocation()}>
                          Minta Lokasi Lagi
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Lokasi belum tersedia.</p>
                      <div className="mt-2">
                        <Button variant="secondary" onClick={() => requestLocation()}>
                          Minta Lokasi
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-sm text-[var(--muted)] space-y-1">
                  <p>Latitude: {lat}</p>
                  <p>Longitude: {lng}</p>
                  <p>Jarak ke kantor: {distance?.toFixed(2)} meter</p>
                </div>
              )}

              {/* Debug controls for testing */}
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-medium">Debug: coba sample lokasi</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setSampleCoords(OFFICE.lat + 0.0001, OFFICE.lng + 0.0001)
                    }
                  >
                    Sample: Dalam Area
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setSampleCoords(OFFICE.lat + 0.02, OFFICE.lng + 0.02)}
                  >
                    Sample: Luar Area
                  </Button>

                  <Button variant="secondary" onClick={resetToActual}>
                    Reset ke GPS
                  </Button>
                </div>
                <p className="text-xs text-[var(--muted)] mt-2">Radius yang digunakan: {RADIUS} m</p>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Action */}
      <Card className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-semibold">Siap melakukan absensi?</p>
          <p className="text-sm text-[var(--muted)]">Lokasi harus berada dalam radius kantor</p>

          <div className="mt-2 text-sm">
            {!photo ? (
              <p className="text-yellow-700">Foto belum diambil.</p>
            ) : !gpsValid ? (
              <p className="text-red-600">Lokasi tidak valid (di luar area).</p>
            ) : null}

            {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}

            {today?.checkIn && today?.checkOut && (
              <p className="mt-2 text-sm text-blue-700 font-medium">✨ Anda sudah menyelesaikan absensi hari ini.</p>
            )}
          </div>
        </div>

        <div className="ml-4">
          <Button
            onClick={submitAttendance}
            disabled={!photo || !gpsValid || submitting || (today?.checkIn && today?.checkOut)}
          >
            {submitting ? "Mengirim..." : (today?.checkIn && !today?.checkOut) ? "Absen Pulang" : "Absen Masuk"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
