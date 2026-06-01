import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } },
      include: { branches: true }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    if (company.branches.length === 0 && (company.cityAr || company.cityEn || company.countryAr || company.addressAr)) {
      const initialBranch = await prisma.branch.create({
        data: {
          companyId: company.id,
          nameEn: "Main Branch",
          nameAr: "الفرع الرئيسي",
          country: company.countryAr || company.countryEn || "",
          governorate: company.governorateAr || company.governorateEn || "",
          city: company.cityAr || company.cityEn || "",
          addressEn: company.addressEn || company.addressAr || "",
          addressAr: company.addressAr || company.addressEn || "",
          phone: company.whatsapp || company.email || ""
        }
      });
      return NextResponse.json([initialBranch]);
    }

    return NextResponse.json(company.branches);
  } catch (error) {
    console.error("[BRANCHES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const branch = await prisma.branch.create({
      data: {
        companyId: company.id,
        nameEn: body.nameEn || "",
        nameAr: body.nameAr || "",
        country: body.country || "",
        governorate: body.governorate || "",
        city: body.city || "",
        addressEn: body.addressEn || "",
        addressAr: body.addressAr || "",
        phone: body.phone || ""
      }
    });

    return NextResponse.json(branch);
  } catch (error) {
    console.error("[BRANCHES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
