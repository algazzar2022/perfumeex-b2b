import { prisma } from "@/lib/prisma";
import SearchClient from "./_components/SearchClient";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; category?: string; location?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";
  const category = resolvedSearchParams.category || "";
  const location = resolvedSearchParams.location || "";

  let companies: any[] = [];

  if (query.trim() !== "" || category.trim() !== "" || location.trim() !== "") {
    const andConditions: any[] = [{ status: 'APPROVED' }];

    if (query.trim() !== "") {
      const terms = query.trim().split(/\s+/).filter(t => t.length > 1);
      
      if (terms.length > 0) {
        const termConditions = terms.map(term => ({
          OR: [
            { nameEn: { contains: term } },
            { nameAr: { contains: term } },
            { category: { contains: term } },
            { cityEn: { contains: term } },
            { cityAr: { contains: term } },
            { governorateEn: { contains: term } },
            { governorateAr: { contains: term } },
            {
              branches: {
                some: {
                  OR: [
                    { cityEn: { contains: term } },
                    { cityAr: { contains: term } },
                    { governorateEn: { contains: term } },
                    { governorateAr: { contains: term } },
                  ]
                }
              }
            }
          ]
        }));

        andConditions.push({
          OR: termConditions
        });
      } else {
        andConditions.push({
          OR: [
            { nameEn: { contains: query } },
            { nameAr: { contains: query } }
          ]
        });
      }
    }

    if (category.trim() !== "") {
      andConditions.push({
        category: { contains: category },
      });
    }

    if (location.trim() !== "") {
      andConditions.push({
        OR: [
          { governorateEn: { contains: location } },
          { governorateAr: { contains: location } },
          { cityEn: { contains: location } },
          { cityAr: { contains: location } },
          {
            branches: {
              some: {
                OR: [
                  { governorateEn: { contains: location } },
                  { governorateAr: { contains: location } },
                  { cityEn: { contains: location } },
                  { cityAr: { contains: location } },
                ]
              }
            }
          }
        ],
      });
    }

    companies = await prisma.company.findMany({
      where: {
        AND: andConditions,
      },
      include: {
        products: {
          take: 1, // Include at least one product just in case
        },
      },
      take: 20, // Limit results
    });

    // Sort: 1 first, 2 second. If 0, push to bottom.
    companies.sort((a, b) => {
      const orderA = a.order && a.order > 0 ? a.order : 999999;
      const orderB = b.order && b.order > 0 ? b.order : 999999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return 0;
    });
  } else {
    // If no query or filters, return empty results
    companies = [];
  }

  return (
    <SearchClient 
      initialQuery={query} 
      initialResults={companies} 
      locale={resolvedParams.locale} 
    />
  );
}
