import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./_components/ProfileClient";

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ locale: string; "company-slug": string }>;
}) {
  const resolvedParams = await params;
  
  const company = await prisma.company.findUnique({
    where: {
      slug: resolvedParams["company-slug"],
    },
    include: {
      products: true,
      branches: true,
      galleries: true,
    },
  });

  if (!company) {
    return notFound();
  }

  // Record a page view
  await prisma.company.update({
    where: { id: company.id },
    data: { profileViews: { increment: 1 } }
  }).catch(() => {});

  return <ProfileClient company={company} locale={resolvedParams.locale} />;
}
