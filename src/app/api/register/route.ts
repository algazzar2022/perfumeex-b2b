import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, nameAr, nameEn } = body;

    if (!email || !password || !nameAr || !nameEn) {
      return new NextResponse("Missing Info", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: nameEn,
        role: "COMPANY_OWNER",
      }
    });

    // Create an initial empty company profile for this user
    await prisma.company.create({
      data: {
        userId: user.id,
        nameAr,
        nameEn,
        slug: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4),
        status: "PENDING",
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
