"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message ?? `Login gagal (status ${res?.status})`);
        setLoading(false);
        return;
      }

      // success — navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">My Absensi</h1>
        <p className="text-gray-500 mb-6">Silakan login untuk melanjutkan</p>

        <div className="space-y-4">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
          <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={submit} disabled={loading || !email || !password}>
            {loading ? "Masuk..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
