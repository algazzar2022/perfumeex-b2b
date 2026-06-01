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

    // Auto-create initial branch if none exists, using profile data
    if (company.branches.length === 0 && (company.city || company.country || company.address)) {
      const initialBranch = await prisma.branch.create({
        data: {
          companyId: company.id,
          nameEn: "Main Branch",
          nameAr: "الفرع الرئيسي",
          country: company.country || "",
          governorate: company.governorate || "",
          city: company.city || "",
          addressEn: company.address || "",
          addressAr: company.address || "",
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
