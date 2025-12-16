import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          My Absensi
        </h1>
        <p className="text-gray-500 mb-6">
          Silakan login untuk melanjutkan
        </p>

        <div className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button>Login</Button>
        </div>
      </div>
    </div>
  );
}
