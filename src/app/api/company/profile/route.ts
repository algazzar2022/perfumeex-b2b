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
      where: {
        user: {
          email: session.user.email
        }
      }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const company = await prisma.company.update({
      where: {
        userId: (session.user as any).id
      },
      data: {
        ...body
      }
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
