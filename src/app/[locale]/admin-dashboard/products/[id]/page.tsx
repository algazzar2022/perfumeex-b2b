import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductClient from "./_components/EditProductClient";

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      company: {
        select: { id: true, nameAr: true, nameEn: true }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const companies = await prisma.company.findMany({
    select: { id: true, nameAr: true, nameEn: true },
    orderBy: { nameAr: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <EditProductClient initialProduct={product} companies={companies} />
      </div>
    </div>
  );
}
