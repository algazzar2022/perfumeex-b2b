import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
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
        products: true
      }
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    return NextResponse.json(company.products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
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

    const product = await prisma.product.create({
      data: {
        companyId: company.id,
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
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
