import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { pick, profile, t } from '@/lib/content';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <main id="main" className="p-8">
      <p className="eyebrow">{t(lang, 'hero.available')} — {pick(profile.availability.types[0]!, lang)}</p>
      <h1 className="display text-[clamp(3rem,10vw,10rem)]">{profile.name}</h1>
      <p className="mt-6 max-w-[65ch]">{pick(profile.tagline, lang)}</p>
    </main>
  );
}
