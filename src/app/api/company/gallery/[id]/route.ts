import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

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

    const gallery = await prisma.gallery.delete({
      where: {
        id,
        companyId: company.id
      }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("[GALLERY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
