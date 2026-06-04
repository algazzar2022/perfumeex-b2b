import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCompanyClient from "./_components/EditCompanyClient";

export default async function AdminCompanyEditPage({ params }: { params: { id: string } }) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      branches: true,
      galleries: true,
      user: {
        select: { email: true, name: true }
      }
    }
  });

  if (!company) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <div>
      <EditCompanyClient initialCompany={company} dbCategories={categories} />
    </div>
  );
}
