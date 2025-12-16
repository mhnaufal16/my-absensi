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
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
    } catch (err) {
      alert("Gagal mengakses kamera");
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
