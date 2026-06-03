import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import RegisterClient from './_components/RegisterClient';
import { notFound } from 'next/navigation';

export default async function EventRegistrationPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  const isAr = resolvedParams.locale === 'ar';
  
  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 font-cairo">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
        <RegisterClient event={event} isAr={isAr} />
      </main>
      
    </div>
  );
}
