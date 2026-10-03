import dynamic from 'next/dynamic';
import { pick, projects, t } from '@/lib/content';
import { localePath } from '@/lib/site';
import { CATEGORIES } from '@/lib/schemas';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import type { RailItem } from './ProjectsRail';

// Chargé en différé (Framer Motion + GSAP) ; le HTML est rendu côté serveur.
const ProjectsRail = dynamic(() => import('./ProjectsRail'));

export function Projects({ lang }: { lang: Lang }) {
  const items: RailItem[] = projects.map((p, i) => ({
    slug: p.slug, index: i, title: pick(p.title, lang), client: p.client, location: p.location, year: p.year, summary: pick(p.summary, lang),
    categories: p.categories, accent: p.accent, stack: p.stack, draft: p.draft, href: localePath(lang, `projets/${p.slug}/`),
    results: p.results.map((r) => ({ value: r.value, label: pick(r.label, lang) })),
  }));
  const filters = Object.fromEntries(['all', ...CATEGORIES].map((c) => [c, t(lang, `projects.filters.${c}`)])) as Record<'all' | (typeof CATEGORIES)[number], string>;
  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" eyebrow={t(lang, 'sections.projects.eyebrow')} title={t(lang, 'sections.projects.title')} />
      </div>
      <ProjectsRail
        items={items}
        labels={{
          filters, open: t(lang, 'projects.open'), soon: t(lang, 'projects.soon'), filterLabel: t(lang, 'projects.filterLabel'),
          clearTech: t(lang, 'projects.clearTech'), shown: t(lang, 'projects.shown'), techFilter: t(lang, 'projects.techFilter'),
        }}
      />
    </section>
  );
}
