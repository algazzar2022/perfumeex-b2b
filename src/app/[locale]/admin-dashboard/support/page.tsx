import { getSupportTickets } from './actions';
import SupportClient from './_components/SupportClient';

export default async function AdminSupportPage() {
  const tickets = await getSupportTickets();
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">رسائل الدعم الفني</h1>
          <p className="text-gray-400">تابع رسائل واستفسارات المستخدمين والشركات.</p>
        </div>
        
        <SupportClient initialTickets={tickets} />
      </div>
    </div>
  );
}
