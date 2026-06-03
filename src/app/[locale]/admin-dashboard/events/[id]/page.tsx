import { getEventRegistrations } from '../actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import RegistrationsClient from './_components/RegistrationsClient';

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  
  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!event) {
    redirect(`/${resolvedParams.locale}/admin-dashboard/events`);
  }

  const registrations = await getEventRegistrations(resolvedParams.id);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link 
            href={`/${resolvedParams.locale}/admin-dashboard/events`}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowRight className="rtl:rotate-180" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">المسجلين في الفعالية</h1>
            <p className="text-gray-400">{event.titleAr}</p>
          </div>
        </div>

        <RegistrationsClient initialRegistrations={registrations} />
      </div>
    </div>
  );
}
