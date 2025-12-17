import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OFFICE, RADIUS, getDistanceMeters } from "@/lib/office";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, photo, latitude, longitude, type } = body;

    // Basic validation and type coercion
    if (!userId || !photo || latitude == null || longitude == null || !type) {
      console.warn('Invalid payload', body);
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const latNum = Number(latitude);
    const lngNum = Number(longitude);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      console.warn('Invalid lat/lng', { latitude, longitude });
      return NextResponse.json({ message: "Latitude/longitude tidak valid" }, { status: 400 });
    }

    const distance = getDistanceMeters(latNum, lngNum, OFFICE.lat, OFFICE.lng);

    if (distance > RADIUS) {
      return NextResponse.json({ message: "Di luar radius kantor", distance }, { status: 403 });
    }

    // Verify user exists before creating attendance to avoid FK errors
    const uid = Number(userId);
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      return NextResponse.json({ message: `User dengan id ${uid} tidak ditemukan` }, { status: 400 });
    }

    try {
      const attendance = await prisma.attendance.create({
        data: {
          userId: uid,
          photo,
          latitude: latNum,
          longitude: lngNum,
          type, // "IN" | "OUT"
        },
      });

      return NextResponse.json({ success: true, attendance });
    } catch (dbErr) {
      console.error('Prisma create error:', dbErr);
      const detail = process.env.NODE_ENV === 'production' ? undefined : String(dbErr);
      return NextResponse.json({ message: 'Database error', detail }, { status: 500 });
    }
  } catch (error) {
    console.error('API absensi error:', error);
    return NextResponse.json({ message: "Server error", detail: String(error) }, { status: 500 });
  }
}
