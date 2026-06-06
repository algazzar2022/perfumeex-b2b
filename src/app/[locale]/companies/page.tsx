import { prisma } from "@/lib/prisma";
import CompaniesClient from "./_components/CompaniesClient";

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  
  // Fetch all approved companies
  const companies = await prisma.company.findMany({
    where: {
      status: 'APPROVED'
    },
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
    take: 50
  });

  // Sort: 1 first, 2 second. If 0, push to bottom.
  const sortedCompanies = companies.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    // If order is same (both 0 or same number), keep original date sorting
    return 0;
  });

  return (
    <CompaniesClient 
      initialCompanies={sortedCompanies} 
      locale={resolvedParams.locale} 
    />
  );
}
