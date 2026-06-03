import { prisma } from '@/lib/prisma';
import AboutUsClient from './_components/AboutUsClient';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const isAr = resolvedParams.locale === 'ar';

  const setting = await prisma.setting.findUnique({
    where: { key: 'about_page_content' }
  });
  
  let content = null;
  if (setting && setting.value) {
    try {
      content = JSON.parse(setting.value);
    } catch (e) {}
  }

  return <AboutUsClient content={content} isAr={isAr} />;
}
