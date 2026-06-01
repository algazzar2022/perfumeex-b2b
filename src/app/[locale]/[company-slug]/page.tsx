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
    },
  });

  if (!company) {
    return notFound();
  }

  // Record a page view (optional)
  await prisma.analytics.create({
    data: {
      companyId: company.id,
      pageView: 1,
      whatsappClick: 0,
    }
  }).catch(() => {});

  return <ProfileClient company={company} locale={resolvedParams.locale} />;
}
