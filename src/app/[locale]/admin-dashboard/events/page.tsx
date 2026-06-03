import { getEvents } from './actions';
import EventsClient from './_components/EventsClient';

export default async function EventsPage() {
  const events = await getEvents();
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة الفعاليات (Events)</h1>
            <p className="text-gray-400">إضافة وتعديل وحذف الفعاليات ومعاينة المسجلين بها.</p>
          </div>
        </div>
        
        <EventsClient initialEvents={events} />
      </div>
    </div>
  );
}
