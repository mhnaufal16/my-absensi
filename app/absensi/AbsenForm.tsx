"use client";

import { useEffect, useRef, useState } from "react";

export default function AbsenForm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation(pos.coords);
    });
  }, []);

const submitAbsensi = async () => {
  const res = await fetch("/api/absensi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 1,
      photo: "foto_dummy.png",
      latitude: location.latitude,
      longitude: location.longitude,
      type: "IN",
    }),
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message + ` (${data.distance}m)`);
  } else {
    alert(`Absensi berhasil (${data.distance}m dari kantor)`);
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

    <button
      onClick={submitAbsensi}
      className="w-full bg-green-600 text-white p-2 rounded"
    >
      Absen Sekarang
    </button>
    </div>
  );
}
