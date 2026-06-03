import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const body = await request.json();

    // ensure the branch belongs to the company before updating
    const branch = await prisma.branch.updateMany({
      where: {
        id: id,
        companyId: company.id
      },
      data: {
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        countryAr: body.countryAr,
        countryEn: body.countryEn,
        governorateAr: body.governorateAr,
        governorateEn: body.governorateEn,
        cityAr: body.cityAr,
        cityEn: body.cityEn,
        addressEn: body.addressEn,
        addressAr: body.addressAr,
        phone: body.phone
      }
    });

    if (branch.count === 0) {
      return new NextResponse("Branch not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BRANCH_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await prisma.company.findFirst({
      where: { user: { email: session.user.email } }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const branch = await prisma.branch.deleteMany({
      where: {
        id: id,
        companyId: company.id
      }
    });

    if (branch.count === 0) {
      return new NextResponse("Branch not found", { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BRANCH_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
