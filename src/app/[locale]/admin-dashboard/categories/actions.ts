'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function addCategory(data: { nameAr: string, nameEn: string, slug: string, image?: string }) {
  // Get max order
  const maxOrderCategory = await prisma.category.findFirst({
    orderBy: { order: 'desc' }
  });
  const newOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 0;

  await prisma.category.create({
    data: {
      ...data,
      order: newOrder
    }
  });

  revalidatePath('/[locale]/admin-dashboard/categories', 'page');
}

export async function updateCategory(id: string, data: { nameAr: string, nameEn: string, slug: string, image?: string }) {
  await prisma.category.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/categories', 'page');
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/categories', 'page');
}

export async function updateCategoriesOrder(items: { id: string, order: number }[]) {
  await prisma.$transaction(
    items.map(item => 
      prisma.category.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )
  );
  revalidatePath('/[locale]/admin-dashboard/categories', 'page');
}
