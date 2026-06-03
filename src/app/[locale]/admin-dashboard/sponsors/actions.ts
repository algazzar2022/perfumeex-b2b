'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function getSponsors() {
  return await prisma.sponsor.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function addSponsor(data: { nameAr: string, nameEn: string, logo: string }) {
  const maxOrderSponsor = await prisma.sponsor.findFirst({
    orderBy: { order: 'desc' }
  });
  const newOrder = maxOrderSponsor ? maxOrderSponsor.order + 1 : 0;

  await prisma.sponsor.create({
    data: {
      ...data,
      order: newOrder
    }
  });

  revalidatePath('/[locale]/admin-dashboard/sponsors', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function updateSponsor(id: string, data: { nameAr: string, nameEn: string, logo: string }) {
  await prisma.sponsor.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/sponsors', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function deleteSponsor(id: string) {
  await prisma.sponsor.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/sponsors', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function toggleSponsorStatus(id: string, isActive: boolean) {
  await prisma.sponsor.update({
    where: { id },
    data: { isActive }
  });
  revalidatePath('/[locale]/admin-dashboard/sponsors', 'page');
  revalidatePath('/[locale]', 'page');
}

export async function updateSponsorsOrder(items: { id: string, order: number }[]) {
  await prisma.$transaction(
    items.map(item => 
      prisma.sponsor.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )
  );
  revalidatePath('/[locale]/admin-dashboard/sponsors', 'page');
  revalidatePath('/[locale]', 'page');
}
