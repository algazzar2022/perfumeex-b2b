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
      },
      include: {
        galleries: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    return NextResponse.json(company.galleries);
  } catch (error) {
    console.error("[GALLERY_GET]", error);
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
      where: {
        user: {
          email: session.user.email
        }
      }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const gallery = await prisma.gallery.create({
      data: {
        companyId: company.id,
        url: body.url,
        type: "IMAGE"
      }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("[GALLERY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
