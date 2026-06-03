import ContactClient from './_components/ContactClient';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const isAr = resolvedParams.locale === 'ar';

  return <ContactClient isAr={isAr} />;
}
