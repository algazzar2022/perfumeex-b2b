'use server';

import { prisma } from '@/lib/prisma';

export async function getCompaniesPaginated(page: number, limit: number) {
  // 1. Fetch lightweight data for sorting
  const allCompanies = await prisma.company.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, order: true, createdAt: true }
  });

  // 2. Sort globally in memory
  allCompanies.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  // 3. Get IDs for the current page
  const pageIds = allCompanies.slice((page - 1) * limit, page * limit).map(c => c.id);

  if (pageIds.length === 0) return [];

  // 4. Fetch full data for these IDs
  const companiesData = await prisma.company.findMany({
    where: { id: { in: pageIds } },
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
    }
  });

  // 5. Restore the exact sorted order
  return pageIds.map(id => companiesData.find(c => c.id === id)).filter(Boolean);
}

export async function getTotalCompaniesCount() {
  return await prisma.company.count({
    where: { status: 'APPROVED' }
  });
}
