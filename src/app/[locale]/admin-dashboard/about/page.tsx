import { getAboutContent } from './actions';
import AboutClient from './_components/AboutClient';

export default async function AdminAboutPage() {
  const content = await getAboutContent();
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إدارة صفحة "من نحن"</h1>
          <p className="text-gray-400">تحكم بالكامل في محتوى صفحة من نحن.</p>
        </div>
        
        <AboutClient initialContent={content} />
      </div>
    </div>
  );
}
