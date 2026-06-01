import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { companyId, type } = await request.json();

    if (!companyId || !type) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (type === "contact") {
      await prisma.company.update({
        where: { id: companyId },
        data: { contactClicks: { increment: 1 } }
      });
      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid type", { status: 400 });
  } catch (error) {
    console.error("[COMPANY_TRACK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
