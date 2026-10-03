import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { pick, profile } from '@/lib/content';

export default async function CvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <main id="main" className="p-8">
      <h1 className="display text-5xl">{profile.name}</h1>
      <p className="mt-4">{pick(profile.title, lang)}</p>
    </main>
  );
}
