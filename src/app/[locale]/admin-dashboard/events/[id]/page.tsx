import { getEventRegistrations } from '../actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

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

        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-semibold text-gray-300">الاسم</th>
                  <th className="p-4 font-semibold text-gray-300">السن</th>
                  <th className="p-4 font-semibold text-gray-300">اسم البراند</th>
                  <th className="p-4 font-semibold text-gray-300">المكان</th>
                  <th className="p-4 font-semibold text-gray-300">رقم الاتصال</th>
                  <th className="p-4 font-semibold text-gray-300">واتساب</th>
                  <th className="p-4 font-semibold text-gray-300">سنوات الخبرة</th>
                  <th className="p-4 font-semibold text-gray-300">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-emerald-400">{reg.name}</td>
                    <td className="p-4">{reg.age}</td>
                    <td className="p-4 text-blue-300">{reg.brandName}</td>
                    <td className="p-4">{reg.location}</td>
                    <td className="p-4">{reg.phone}</td>
                    <td className="p-4">{reg.whatsapp}</td>
                    <td className="p-4 font-medium text-orange-400">{reg.experienceYears}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(reg.createdAt).toLocaleDateString('ar-EG')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {registrations.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">لا يوجد أي مسجلين في هذه الفعالية حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
