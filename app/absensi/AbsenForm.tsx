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
    // 1. Get userId and settings from cookies
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };
    const uidStr = getCookie("userId");
    const uid = uidStr ? Number(uidStr) : null;

    if (!uid) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      window.location.href = "/login";
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera error:", err));

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

    // fetch today's attendance for dynamic userId
    (async () => {
      try {
        const res = await fetch(`/api/absensi?userId=${uid}`);
        const data = await res.json();
        if (data.success) {
          // If it's an array (list), or single object? API usually returns 'attendance' which might be list or single.
          // Let's check API. GET returns `attendance` which is findFirst (single) or findMany (array) based on 'todayOnly'.
          // The client previously expected simple object: setToday(data.attendance)
          // But if we want history, we might get an array.
          // Let's assuming for 'today' state we just want the latest status to determine checkin/checkout buttons.
          // But for history list, we want the array.

          // Warning: The original API call was `fetch('/api/absensi?userId=1')`. 
          // API defaults to `todayOnly=true` (unless `todayOnly=false` passed).
          // If `todayOnly` is true (default), it returns `findFirst`. So it's an object.
          // We need to fetch HISTORY to show the list.

          if (Array.isArray(data.attendance)) {
            // If array, take the first one as 'today' status if matches today? 
            // Actually API logic: if todayOnly, returns findFirst. So it is NOT array.
            setToday(data.attendance);
          } else {
            setToday(data.attendance);
          }
        }
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

    // 1. Draw video
    ctx.drawImage(video, 0, 0, w, h);

    // 2. Add Watermark / Timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const latInfo = location?.latitude ? location.latitude.toFixed(6) : 'N/A';
    const lngInfo = location?.longitude ? location.longitude.toFixed(6) : 'N/A';
    const locStr = `Loc: ${latInfo}, ${lngInfo}`;

    // Background shade for text readability
    const barHeight = 60;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, h - barHeight, w, barHeight);

    // Text settings
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px monospace';
    // Remove shadow if not needed, or keep for contrast
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 2;

    // Draw lines
    ctx.fillText(`${dateStr} - ${timeStr}`, 15, h - 35);
    ctx.fillText(locStr, 15, h - 15);

    // default to jpeg base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  const submitAbsensi = async (action: 'checkin' | 'checkout') => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };
    const uidStr = getCookie("userId");
    const uid = uidStr ? Number(uidStr) : null;

    if (!uid) {
      alert("Sesi habis. Silakan login kembali.");
      return;
    }

    if (!location) {
      alert('Lokasi belum tersedia. Pastikan GPS/perizinan lokasi telah diizinkan.');
      return;
    }
    const scheduledStart = new Date();
    scheduledStart.setHours(8, 0, 0, 0);
    const scheduledEnd = new Date();
    scheduledEnd.setHours(17, 0, 0, 0);

    setLoading(true);
    const photoData = capturePhoto() ?? "";
    const payload = {
      userId: uid, // Dynamic user ID
      photo: photoData,
      latitude: location.latitude,
      longitude: location.longitude, // Corrected typo from original code if any, though previous was fine
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

      <div className="space-y-4">
        <div className="flex gap-2">
          {!today || !today.checkIn ? (
            <button onClick={() => submitAbsensi('checkin')} disabled={!geoReady || loading} className={`flex-1 p-2 rounded ${geoReady && !loading ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
              {loading ? 'Mengirim...' : 'Check In'}
            </button>
          ) : null}

          {today && today.checkIn && !today.checkOut ? (
            <button onClick={() => submitAbsensi('checkout')} disabled={!geoReady || loading} className={`flex-1 p-2 rounded ${geoReady && !loading ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
              {loading ? 'Mengirim...' : 'Check Out'}
            </button>
          ) : null}
        </div>

        {today && today.checkIn && today.checkOut && (
          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded text-center">Anda sudah melakukan check-in dan check-out hari ini.</div>
        )}

        {!geoReady && (
          <p className="text-xs text-red-600">Lokasi belum tersedia — izinkan akses lokasi di browser atau coba muat ulang.</p>
        )}

        {/* History Section */}
        {today && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-bold text-gray-700 mb-2">Riwayat Hari Ini</h3>
            <div className="text-sm space-y-1">
              {today.checkIn && <div className="flex justify-between"><span>Check In:</span> <span className="font-mono">{new Date(today.checkIn).toLocaleTimeString()}</span></div>}
              {today.checkOut && <div className="flex justify-between"><span>Check Out:</span> <span className="font-mono">{new Date(today.checkOut).toLocaleTimeString()}</span></div>}
              <div className="flex justify-between font-bold text-gray-900 mt-2">
                <span>Status:</span>
                <span className={today.status === 'ontime' ? 'text-green-600' : 'text-red-600'}>{today.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
