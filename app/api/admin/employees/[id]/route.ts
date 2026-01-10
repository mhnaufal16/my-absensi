import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("userRole")?.value;

        if (userRole !== "ADMIN") {
            return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
        }

        const id = parseInt(params.id);
        const { name, email, password } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
        }

        const existing = await prisma.user.findFirst({
            where: {
                email,
                NOT: { id }
            }
        });

        if (existing) {
            return NextResponse.json({ message: "Email sudah digunakan oleh akun lain" }, { status: 400 });
        }

        const updateData: any = { name, email };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Update employee error", error);
        return NextResponse.json({ message: "Gagal memperbarui data karyawan" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("userRole")?.value;

        if (userRole !== "ADMIN") {
            return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
        }

        const id = parseInt(params.id);

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete employee error", error);
        return NextResponse.json({ message: "Gagal menghapus data karyawan" }, { status: 500 });
    }
}
