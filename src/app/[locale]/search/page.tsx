import { prisma } from "@/lib/prisma";
import SearchClient from "./_components/SearchClient";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || "";

  let companies: any[] = [];

  if (query.trim() !== "") {
    companies = await prisma.company.findMany({
      where: {
        OR: [
          { nameEn: { contains: query } },
          { nameAr: { contains: query } },
          { category: { contains: query } },
          { cityEn: { contains: query } },
          { cityAr: { contains: query } },
          { governorateEn: { contains: query } },
          { governorateAr: { contains: query } },
        ],
      },
      include: {
        products: {
          take: 1, // Include at least one product just in case
        },
      },
      take: 20, // Limit results
    });
  } else {
    // If no query, return some companies (or trending ones)
    companies = await prisma.company.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <SearchClient 
      initialQuery={query} 
      initialResults={companies} 
      locale={resolvedParams.locale} 
    />
  );
}
