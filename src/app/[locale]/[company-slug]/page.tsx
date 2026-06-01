import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./_components/ProfileClient";

export default async function CompanyProfilePage({
  params,
}: {
  params: { locale: string; "company-slug": string };
}) {
  const company = await prisma.company.findUnique({
    where: {
      slug: params["company-slug"],
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

  return <ProfileClient company={company} locale={params.locale} />;
}
