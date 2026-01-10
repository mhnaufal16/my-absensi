"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

export default function KaryawanPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Edit state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/admin/employees");
            const data = await res.json();
            // FILTER: Only show USERS (Employees) here
            setUsers(data.filter((u: any) => u.role === "USER"));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAdd = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/employees", {
                method: "POST",
                body: JSON.stringify({ name, email, password, role: "USER" }),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchEmployees();
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

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setPassword(""); // Reset password field
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/employees/${editingUser.id}`, {
                method: "PATCH",
                body: JSON.stringify({ name, email, password: password || undefined }),
            });
            if (res.ok) {
                setIsEditModalOpen(false);
                setEditingUser(null);
                fetchEmployees();
                setName(""); setEmail(""); setPassword("");
            } else {
                const data = await res.json();
                alert(data.message || "Gagal memperbarui karyawan");
            }
        } catch (e) {
            alert("Terjadi kesalahan");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) return;

        try {
            const res = await fetch(`/api/admin/employees/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchEmployees();
            } else {
                const data = await res.json();
                alert(data.message || "Gagal menghapus karyawan");
            }
        } catch (e) {
            alert("Terjadi kesalahan");
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Data Karyawan</h1>
                    <p className="text-slate-500 font-medium mt-1">Kelola profil dan akun operasional seluruh anggota tim Anda.</p>
                </div>
                <Button variant="primary" onClick={() => setIsModalOpen(true)} className="h-12 px-6">
                    <span className="text-xl">+</span> Tambah Karyawan
                </Button>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Memproses Database...</p>
                </div>
            ) : (
                <Card className="p-0 overflow-hidden border-none shadow-premium bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identitas Karyawan</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Resmi</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peran Akses</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-500">{user.email}</td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <Badge variant="success">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors" title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum Ada Data Karyawan</p>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <Card className="p-10 border-none shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16"></div>

                            <div>
                                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Karyawan Baru</h2>
                                <p className="text-slate-500 font-medium">Daftarkan akun operasional untuk tim baru.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                    <Input placeholder="Contoh: Muhammad Naufal" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Alamat Email</label>
                                    <Input placeholder="naufal@perusahaan.com" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Kata Sandi</label>
                                    <Input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 h-12">Batal</Button>
                                <Button variant="primary" onClick={handleAdd} disabled={submitting || !name || !email || !password} className="flex-1 h-12">
                                    {submitting ? "Mendaftarkan..." : "Konfirmasi Akun"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
                    <div className="w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <Card className="p-10 border-none shadow-2xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16"></div>

                            <div>
                                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Edit Karyawan</h2>
                                <p className="text-slate-500 font-medium">Perbarui informasi akun karyawan.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                                    <Input placeholder="Contoh: Muhammad Naufal" value={name} onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Alamat Email</label>
                                    <Input placeholder="naufal@perusahaan.com" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Kata Sandi Baru (Kosongkan jika tidak diubah)</label>
                                    <Input placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button variant="secondary" onClick={() => { setIsEditModalOpen(false); setEditingUser(null); setName(""); setEmail(""); setPassword(""); }} className="flex-1 h-12">Batal</Button>
                                <Button variant="primary" onClick={handleUpdate} disabled={submitting || !name || !email} className="flex-1 h-12">
                                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
