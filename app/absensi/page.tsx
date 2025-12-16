import CameraPreview from "@/components/absensi/CameraPreview";
import LocationInfo from "@/components/absensi/LocationInfo";
import Button from "@/components/ui/Button";

export default function AbsensiPage() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-800">
        Absensi Hari Ini
      </h1>

      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <CameraPreview />
      </div>

      <LocationInfo />

      <Button>
        Absen Masuk
      </Button>
    </div>
  );
}
