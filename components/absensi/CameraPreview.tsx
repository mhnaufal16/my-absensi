"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type CameraPreviewProps = {
  onCapture: (image: string) => void;
};

export default function CameraPreview({ onCapture }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  useEffect(() => {
    // Cek permission kamera sebelum mencoba akses
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" as PermissionName })
        .then((result) => {
          if (result.state === "denied") {
            alert("Akses kamera ditolak. Silakan izinkan kamera di browser.");
          }
        });
    }
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser tidak mendukung kamera");
        return;
      }
      // Cek permission kamera secara eksplisit (untuk browser modern)
      if (navigator.permissions) {
        const perm = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        if (perm.state === "denied") {
          alert("Akses kamera ditolak. Silakan izinkan kamera di browser.");
          return;
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Gagal mengakses kamera:", err);
      alert(
        "Gagal mengakses kamera: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg");
    setCaptured(imageData);
    onCapture(imageData);

    stopCamera();
  };

  const retake = () => {
    setCaptured(null);
    startCamera();
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        {!captured ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={captured}
            alt="Hasil foto"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {!captured ? (
        <Button onClick={capturePhoto} className="w-full">
          Ambil Foto
        </Button>
      ) : (
        <Button variant="secondary" onClick={retake} className="w-full">
          Ambil Ulang
        </Button>
      )}
    </div>
  );
}
