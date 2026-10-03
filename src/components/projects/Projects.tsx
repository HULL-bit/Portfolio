import { projects, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { ProjectCard } from './ProjectCard';

const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7', 'lg:col-span-6', 'lg:col-span-6'];

export function Projects({ lang }: { lang: Lang }) {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" eyebrow={t(lang, 'sections.projects.eyebrow')} title={t(lang, 'sections.projects.title')} />
        <div className="grid12">
          {projects.map((p, i) => (
            <div key={p.slug} className={`col-span-12 ${SPANS[i % SPANS.length]}`}>
              <ProjectCard project={p} index={i} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
