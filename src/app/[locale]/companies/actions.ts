'use server';

import { prisma } from '@/lib/prisma';

export async function getCompaniesPaginated(page: number, limit: number) {
  const companies = await prisma.company.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      descriptionAr: true,
      descriptionEn: true,
      category: true,
      isSponsor: true,
      isFeatured: true,
      coverImage: true,
      logo: true,
      addressAr: true,
      addressEn: true,
      cityAr: true,
      cityEn: true,
      governorateAr: true,
      governorateEn: true,
      countryAr: true,
      countryEn: true,
      isVerified: true,
      slug: true,
      order: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  });

  // Sort: 1 first, 2 second. If 0, push to bottom.
  return companies.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return 0;
  });
}

export async function getTotalCompaniesCount() {
  return await prisma.company.count({
    where: { status: 'APPROVED' }
  });
}
