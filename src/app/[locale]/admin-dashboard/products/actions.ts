"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      company: {
        select: {
          nameAr: true,
          nameEn: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return products.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return 0;
  });
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  await prisma.product.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}

export async function updateProduct(
  id: string, 
  data: { 
    isFeatured?: boolean;
    order?: number;
  }
) {
  await prisma.product.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}
