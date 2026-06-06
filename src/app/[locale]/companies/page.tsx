import { prisma } from "@/lib/prisma";
import CompaniesClient from "./_components/CompaniesClient";

export default async function CompaniesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  
  // Fetch only the first 3 approved companies initially for extremely fast loading, ensuring global custom sorting
  const { getCompaniesPaginated } = await import('./actions');
  const sortedCompanies = await getCompaniesPaginated(1, 3);

  // Get total count so the client knows if there are more
  const totalCount = await prisma.company.count({
    where: { status: 'APPROVED' }
  });

  return (
    <CompaniesClient 
      initialCompanies={sortedCompanies} 
      totalCount={totalCount}
      locale={resolvedParams.locale} 
    />
  );
}
