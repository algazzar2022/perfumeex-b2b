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

export async function updateProductsStatus(ids: string[], status: ProductStatus) {
  await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { status }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}

export async function updateProduct(
  id: string, 
  data: { 
    nameAr?: string;
    nameEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    price?: number | null;
    image?: string;
    stockStatus?: string;
    salesType?: string;
    companyId?: string;
    categoryId?: string;
    isFeatured?: boolean;
    order?: number;
    status?: ProductStatus;
  }
) {
  await prisma.product.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}

export async function createProduct(data: {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price?: number;
  image?: string;
  stockStatus?: string;
  salesType?: string;
  companyId: string;
  categoryId?: string;
  isFeatured?: boolean;
  order?: number;
}) {
  const newProduct = await prisma.product.create({
    data: {
      ...data,
      status: 'APPROVED',
    },
    include: {
      company: {
        select: {
          nameAr: true,
          nameEn: true,
        }
      }
    }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
  return newProduct;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}

export async function deleteProducts(ids: string[]) {
  await prisma.product.deleteMany({
    where: { id: { in: ids } }
  });
  revalidatePath('/[locale]/admin-dashboard/products', 'page');
}
