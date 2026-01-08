"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function KaryawanPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/employees");
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/employees", {
                method: "POST",
                body: JSON.stringify({ name, email, password, role }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchUsers();
                setName(""); setEmail(""); setPassword("");
            } else {
                const data = await res.json();
                alert(data.message || "Gagal menambah karyawan");
            }
        } catch (e) {
            alert("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Data Karyawan</h1>
                    <p className="text-gray-600">Kelola informasi dan akun karyawan Anda</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Tambah Karyawan</Button>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <Card className="p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-md w-full p-6 space-y-4">
                        <h2 className="text-xl font-bold">Tambah Karyawan Baru</h2>
                        <div className="space-y-4">
                            <Input placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} />
                            <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="USER">USER (Karyawan)</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="flex gap-3 justify-end pt-4">
                            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                            <Button variant="primary" onClick={handleAdd} disabled={submitting || !name || !email || !password}>
                                {submitting ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
