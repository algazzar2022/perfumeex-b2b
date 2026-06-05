import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCompanyClient from "./_components/EditCompanyClient";

export default async function AdminCompanyEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });

  if (resolvedParams.id === 'new') {
    const emptyCompany = {
      id: '',
      nameAr: '',
      nameEn: '',
      slug: '',
      descriptionAr: '',
      descriptionEn: '',
      email: '',
      password: '',
      status: 'APPROVED',
      order: 0,
      branches: [],
      galleries: [],
      user: { email: '' }
    };
    return (
      <div>
        <EditCompanyClient initialCompany={emptyCompany} dbCategories={categories} isNew={true} />
      </div>
    );
  }

  const company = await prisma.company.findUnique({
    where: { id: resolvedParams.id },
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



  return (
    <div>
      <EditCompanyClient initialCompany={company} dbCategories={categories} isNew={false} />
    </div>
  );
}
