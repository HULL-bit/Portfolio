import { notFound } from 'next/navigation';
import { LOCALES, isLang } from '@/lib/i18n';
import { getProject, pick, projects } from '@/lib/content';

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!isLang(lang) || !project) notFound();
  return (
    <main id="main" className="p-8">
      <h1 className="display text-[clamp(3rem,8vw,8rem)]">{pick(project.title, lang)}</h1>
      <p className="mt-6 max-w-[65ch]">{pick(project.summary, lang)}</p>
    </main>
  );
}
