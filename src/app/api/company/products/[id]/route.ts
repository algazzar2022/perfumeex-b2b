import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
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

    const product = await prisma.product.update({
      where: {
        id,
        companyId: company.id
      },
      data: {
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        descriptionEn: body.descriptionEn,
        descriptionAr: body.descriptionAr,
        price: body.price ? parseFloat(body.price) : null,
        stockStatus: body.stockStatus,
        salesType: body.salesType,
        image: body.image,
        categoryId: body.categoryId || null
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    const product = await prisma.product.delete({
      where: {
        id,
        companyId: company.id
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
