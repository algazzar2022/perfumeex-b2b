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
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  return (
    <CompaniesClient 
      initialCompanies={companies} 
      locale={resolvedParams.locale} 
    />
  );
}
