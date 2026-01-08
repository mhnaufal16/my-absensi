import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const settings = await (prisma as any).setting.findMany();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ message: "Gagal mengambil pengaturan" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userRole = cookieStore.get("userRole")?.value;

        if (userRole !== "ADMIN") {
            return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
        }

        const { settings } = await request.json(); // Expected: { workStartTime: "08:00", ... }

        if (!settings || typeof settings !== 'object') {
            return NextResponse.json({ message: "Format data salah" }, { status: 400 });
        }

        const upserts = Object.entries(settings).map(([key, value]) =>
            (prisma as any).setting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            })
        );

        await Promise.all(upserts);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update settings error", error);
        return NextResponse.json({ message: "Gagal menyimpan pengaturan" }, { status: 500 });
    }
}
