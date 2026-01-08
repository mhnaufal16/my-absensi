"use client";

import { useEffect, useRef, useState } from "react";
import { OFFICE } from "@/lib/office";

export default function AbsenForm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [today, setToday] = useState<any>(null);
  const [geoReady, setGeoReady] = useState<boolean>(false);
  const [usingSampleCoords, setUsingSampleCoords] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        setGeoReady(true);
      },
      (err) => {
        console.error('Geolocation error', err);
        // fallback to sample office coords so user can continue in dev or demo
        const sample = { latitude: OFFICE.lat, longitude: OFFICE.lng } as any;
        setLocation(sample);
        setGeoReady(true);
        setUsingSampleCoords(true);
      },
    );

    // fetch today's attendance for userId 1 (adjust userId as needed)
    (async () => {
      try {
        const res = await fetch(`/api/absensi?userId=1`);
        const data = await res.json();
        if (data.success) setToday(data.attendance);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  function capturePhoto(): string | null {
    const video = videoRef.current;
    if (!video) return null;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, w, h);
    // default to jpeg base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }

const submitAbsensi = async (action: 'checkin'|'checkout') => {
  if (!location) {
    alert('Lokasi belum tersedia. Pastikan GPS/perizinan lokasi telah diizinkan.');
    return;
  }
  const scheduledStart = new Date();
  scheduledStart.setHours(8,0,0,0);
  const scheduledEnd = new Date();
  scheduledEnd.setHours(17,0,0,0);

  setLoading(true);
  const photoData = capturePhoto() ?? "";
  const payload = {
    userId: 1,
    photo: photoData,
    latitude: location.latitude,
    longitude: location.longitude,
    usingSampleCoords: usingSampleCoords,
    action,
    scheduledStart: scheduledStart.toISOString(),
    scheduledEnd: scheduledEnd.toISOString(),
  };

  console.log('Sending attendance payload:', payload);

  try {
    const res = await fetch("/api/absensi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch (e) { data = { text }; }

    console.log('Response status', res.status, data);

    if (!res.ok) {
      alert((data && data.message) ? data.message : `Request failed: ${res.status}`);
    } else {
      alert(`Absensi berhasil: ${data.attendance?.status ?? 'OK'}`);
      setToday(data.attendance);
    }
  } catch (err) {
    console.error('Network error while sending attendance', err);
    alert('Gagal mengirim absensi: ' + String(err));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md">
      <video ref={videoRef} autoPlay className="w-full rounded mb-3" />

      {location && (
        <p className="text-sm mb-3">
          📍 {location.latitude}, {location.longitude}
        </p>
      )}

      <div className="space-y-2">
        {!today || !today.checkIn ? (
          <button onClick={() => submitAbsensi('checkin')} disabled={!geoReady || loading} className={`w-full p-2 rounded ${geoReady && !loading ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            {loading ? 'Mengirim...' : 'Check In'}
          </button>
        ) : today.checkIn && !today.checkOut ? (
          <button onClick={() => submitAbsensi('checkout')} disabled={!geoReady || loading} className={`w-full p-2 rounded ${geoReady && !loading ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
            {loading ? 'Mengirim...' : 'Check Out'}
          </button>
        ) : (
          <div className="text-sm text-gray-700">Anda sudah melakukan check-in dan check-out hari ini.</div>
        )}
        {!geoReady && (
          <p className="text-xs text-red-600">Lokasi belum tersedia — izinkan akses lokasi di browser atau coba muat ulang.</p>
        )}
      </div>
    </div>
  );
}
