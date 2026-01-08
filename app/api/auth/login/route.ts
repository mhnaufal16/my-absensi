import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: (user as any).role }
    });
    // set cookies for demo purposes
    res.cookies.set("userId", String(user.id), { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    res.cookies.set("userRole", (user as any).role, { httpOnly: false, path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err) {
    console.error("Auth login error", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
