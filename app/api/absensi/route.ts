import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDistance,
  OFFICE_LOCATION,
  MAX_RADIUS,
} from "@/utils/geo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, photo, latitude, longitude, type } = body;

    const distance = getDistance(
      latitude,
      longitude,
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng
    );

    if (distance > MAX_RADIUS) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda berada di luar area absensi",
          distance: Math.round(distance),
        },
        { status: 403 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        photo,
        latitude,
        longitude,
        type,
      },
    });

    return NextResponse.json({
      success: true,
      data: attendance,
      distance: Math.round(distance),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal absensi" },
      { status: 500 }
    );
  }
}
