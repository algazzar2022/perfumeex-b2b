import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const isAr = resolvedParams.locale === 'ar';
  
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    where: {
      date: {
        gte: new Date() // Only show upcoming events
      }
    },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 font-cairo">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 pb-2">
            {isAr ? 'الفعاليات والأحداث' : 'Events & Exhibitions'}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mt-6">
            {isAr ? 'انضم إلى أهم الفعاليات والمعارض في عالم العطور والتغليف وتواصل مع صناع القرار.' : 'Join the most important events and exhibitions in the perfume world and connect with decision makers.'}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Calendar size={64} className="mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-2">{isAr ? 'لا توجد فعاليات قادمة حالياً' : 'No upcoming events at the moment'}</h2>
            <p className="text-gray-400">{isAr ? 'تابعنا لمعرفة أحدث الفعاليات قريباً.' : 'Stay tuned for our upcoming events soon.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group shadow-2xl">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image 
                    src={event.image} 
                    alt={isAr ? event.titleAr : event.titleEn} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-emerald-500/90 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                      <Users size={14} />
                      {event._count.registrations} {isAr ? 'مسجل' : 'Registered'}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8 relative">
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                    {isAr ? event.titleAr : event.titleEn}
                  </h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                        <Calendar size={20} />
                      </div>
                      <span className="font-medium text-[15px]">
                        {new Date(event.date).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                      <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
                        <MapPin size={20} />
                      </div>
                      <span className="font-medium text-[15px]">
                        {isAr ? event.locationAr : event.locationEn}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={`/${resolvedParams.locale}/events/${event.id}/register`}
                    className="block w-full py-4 rounded-xl font-bold text-center text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/25"
                  >
                    {isAr ? 'سجل حضورك الآن' : 'Register Now'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
