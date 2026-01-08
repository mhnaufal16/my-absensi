import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Gagal mengambil data karyawan" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("userRole")?.value;

        if (userRole !== "ADMIN") {
            return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
        }

        const { name, email, password, role } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER"
            }
        });

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Create employee error", error);
        return NextResponse.json({ message: "Gagal menambah karyawan" }, { status: 500 });
    }
}
