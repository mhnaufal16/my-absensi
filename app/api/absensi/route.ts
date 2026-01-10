import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OFFICE, RADIUS, getDistanceMeters } from "@/lib/office";
import type { Attendance } from "@prisma/client";

function minutesBetween(a?: Date, b?: Date) {
  if (!a || !b) return null;
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

function computeStatus(checkIn?: Date | null, checkOut?: Date | null, scheduledStart?: Date | null, scheduledEnd?: Date | null) {
  const result: { status: string; durationMinutes: number | null } = { status: "absen", durationMinutes: null };
  if (checkIn) result.status = "ontime";
  if (checkIn && scheduledStart) {
    const late = Math.max(0, Math.round((checkIn.getTime() - scheduledStart.getTime()) / 60000));
    if (late > 5) result.status = "telat";
  }
  if (checkOut && scheduledEnd) {
    const early = Math.max(0, Math.round((scheduledEnd.getTime() - checkOut.getTime()) / 60000));
    if (early > 5) result.status = "pulang_dini";
  }
  if (checkIn && checkOut) {
    result.durationMinutes = minutesBetween(checkIn, checkOut);
  }
  return result;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const todayOnly = url.searchParams.get("todayOnly") !== "false";

    if (!userId) return NextResponse.json({ message: "userId required" }, { status: 400 });

    const uid = Number(userId);
    const where: any = { userId: uid };

    if (todayOnly) {
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      where.createdAt = { gte: start, lt: end };
    }

    const attendance = todayOnly
      ? await prisma.attendance.findFirst({ where })
      : await prisma.attendance.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });

    return NextResponse.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error", detail: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, photo, latitude, longitude, action, scheduledStart, scheduledEnd, usingSampleCoords } = body;

    // allow frontend to request fallback to OFFICE coords when usingSampleCoords is true
    let latNum = latitude != null ? Number(latitude) : null;
    let lngNum = longitude != null ? Number(longitude) : null;
    if ((latNum == null || lngNum == null) && usingSampleCoords) {
      latNum = OFFICE.lat;
      lngNum = OFFICE.lng;
    }

    const missing: string[] = [];
    if (!userId) missing.push('userId');
    if (latNum == null) missing.push('latitude');
    if (lngNum == null) missing.push('longitude');
    if (!action) missing.push('action');

    if (missing.length > 0) {
      console.warn('Invalid attendance payload, missing fields:', missing, body);
      return NextResponse.json({ message: "Data tidak lengkap", missing, received: body }, { status: 400 });
    }

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return NextResponse.json({ message: "Latitude/longitude tidak valid" }, { status: 400 });
    }

    const distance = getDistanceMeters(latNum as number, lngNum as number, OFFICE.lat, OFFICE.lng);
    if (distance > RADIUS) {
      return NextResponse.json({ message: "Di luar radius kantor", distance }, { status: 403 });
    }

    const uid = Number(userId);
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return NextResponse.json({ message: `User dengan id ${uid} tidak ditemukan` }, { status: 400 });

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const existing = (await prisma.attendance.findFirst({ where: { userId: uid, createdAt: { gte: start, lt: end } } })) as Attendance | null;

    // Fetch settings for scheduling
    const dbSettings = await (prisma as any).setting.findMany();
    const getS = (key: string, def: string) => dbSettings.find((s: any) => s.key === key)?.value || def;

    const sStartStr = getS('workStartTime', '08:00');
    const sEndStr = getS('workEndTime', '17:00');

    const [sStartH, sStartM] = sStartStr.split(':').map(Number);
    const [sEndH, sEndM] = sEndStr.split(':').map(Number);

    const schedStart = new Date(now);
    schedStart.setHours(sStartH, sStartM, 0, 0);
    const schedEnd = new Date(now);
    schedEnd.setHours(sEndH, sEndM, 0, 0);

    if (action === "checkin") {
      if (existing && existing.checkIn) {
        return NextResponse.json({ message: "Sudah check-in" }, { status: 400 });
      }

      const data = {
        userId: uid,
        photo: photo ?? existing?.photo ?? "",
        latitude: latNum as number,
        longitude: lngNum as number,
        type: "IN",
        checkIn: now,
        scheduledStart: schedStart,
        scheduledEnd: schedEnd,
      };

      let attendance: Attendance;
      if (existing) {
        attendance = await prisma.attendance.update({ where: { id: existing.id }, data: data as any });
      } else {
        attendance = await prisma.attendance.create({ data: data as any });
      }

      const computed = computeStatus(attendance.checkIn ? new Date(attendance.checkIn) : null, attendance.checkOut ? new Date(attendance.checkOut) : null, schedStart, schedEnd);
      await prisma.attendance.update({ where: { id: attendance.id }, data: { status: computed.status } });

      return NextResponse.json({ success: true, attendance: { ...attendance, status: computed.status }, distance });
    }

    if (action === "checkout") {
      if (!existing || !existing.checkIn) {
        return NextResponse.json({ message: "Belum melakukan check-in" }, { status: 400 });
      }

      const attendance = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkOut: now,
          photo: photo ?? existing.photo,
          latitude: latNum as number,
          longitude: lngNum as number,
          type: "OUT",
          scheduledStart: schedStart,
          scheduledEnd: schedEnd
        } as any
      });

      const computed = computeStatus(attendance.checkIn ? new Date(attendance.checkIn) : null, attendance.checkOut ? new Date(attendance.checkOut) : null, schedStart, schedEnd);
      await prisma.attendance.update({ where: { id: attendance.id }, data: { status: computed.status, durationMinutes: computed.durationMinutes } });

      return NextResponse.json({ success: true, attendance: { ...attendance, status: computed.status, durationMinutes: computed.durationMinutes }, distance });
    }

    return NextResponse.json({ message: "Action tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error('API absensi error:', error);
    return NextResponse.json({ message: "Server error", detail: String(error) }, { status: 500 });
  }
}
