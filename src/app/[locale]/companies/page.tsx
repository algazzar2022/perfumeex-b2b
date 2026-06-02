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
    orderBy: {
      createdAt: 'desc'
    },
    take: 50 // Limit to avoid massive payloads, we can add pagination later
  });

  return (
    <CompaniesClient 
      initialCompanies={companies} 
      locale={resolvedParams.locale} 
    />
  );
}
