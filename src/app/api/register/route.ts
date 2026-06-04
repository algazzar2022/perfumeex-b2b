import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, password, nameAr, nameEn,
      whatsapp, category, governorateAr, governorateEn, 
      cityAr, cityEn, logo, coverImage, descriptionAr, descriptionEn 
    } = body;

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

    await prisma.company.create({
      data: {
        userId: user.id,
        nameAr,
        nameEn,
        whatsapp: whatsapp || null,
        category: category || "readyPerfumes",
        governorateAr: governorateAr || null,
        governorateEn: governorateEn || null,
        cityAr: cityAr || null,
        cityEn: cityEn || null,
        logo: logo || null,
        coverImage: coverImage || null,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
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
