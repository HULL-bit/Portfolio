import { pick, profile, projects, t } from '@/lib/content';
import { localePath } from '@/lib/site';
import { CATEGORIES } from '@/lib/schemas';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { ProjectMedia } from './ProjectMedia';
import { ProjectsShowcase, type ShowcaseItem } from './ProjectsShowcase';

export function Projects({ lang }: { lang: Lang }) {
  const items: ShowcaseItem[] = projects.map((p, i) => ({
    slug: p.slug, index: i, featured: p.featured, title: pick(p.title, lang), client: p.client, location: p.location, year: p.year,
    status: p.status, statusLabel: t(lang, `projects.status.${p.status}`), statusNote: p.statusNote ? pick(p.statusNote, lang) : null,
    summary: pick(p.summary, lang),
    technical: p.technical.slice(0, 3).map((x) => ({ title: pick(x.title, lang), text: pick(x.text, lang) })),
    results: p.results.map((r) => ({ value: r.value, label: pick(r.label, lang) })),
    stack: p.stack, categories: p.categories, accent: p.accent, href: localePath(lang, `projets/${p.slug}/`),
    demo: p.demo, repo: p.repo, repoLabel: p.repoLabel ? pick(p.repoLabel, lang) : null,
    media: <ProjectMedia project={p} lang={lang} sizes="(min-width: 960px) 52vw, 92vw" />,
    mediaHasLink: p.imageKind === 'diagram' && p.images.length > 0,
  }));
  const filters = Object.fromEntries(['all', ...CATEGORIES].map((c) => [c, t(lang, `projects.filters.${c}`)])) as Record<'all' | (typeof CATEGORIES)[number], string>;
  return (
    <section id="projects" className="section projects-section" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" eyebrow={t(lang, 'sections.projects.eyebrow')} title={t(lang, 'sections.projects.title')} />
        <p className="prose" style={{ marginTop: '-2rem', marginBottom: '2.5rem' }}>{t(lang, 'projects.intro')}</p>
      </div>
      <ProjectsShowcase
        items={items}
        labels={{
          filters, filterLabel: t(lang, 'projects.filterLabel'), clearTech: t(lang, 'projects.clearTech'), techFilter: t(lang, 'projects.techFilter'),
          shown: t(lang, 'projects.shown'), open: t(lang, 'projects.open'), visit: t(lang, 'projects.visit'), code: t(lang, 'projects.code'),
          technical: t(lang, 'projects.technical'), others: t(lang, 'projects.others'), allRepos: t(lang, 'projects.allRepos'),
          githubUrl: profile.contact.github, none: t(lang, 'projects.none'), reset: t(lang, 'projects.reset'),
        }}
      />
    </section>
  );
}
