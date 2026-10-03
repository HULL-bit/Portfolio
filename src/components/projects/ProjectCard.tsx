import Link from 'next/link';
import { pick, t } from '@/lib/content';
import { localePath } from '@/lib/site';
import type { Project } from '@/lib/schemas';
import type { Lang } from '@/lib/i18n';

export function ProjectCard({ project, index, lang }: { project: Project; index: number; lang: Lang }) {
  const href = localePath(lang, `projets/${project.slug}/`);
  return (
    <article className="glass project-card" data-cursor="open" style={{ ['--accent' as string]: project.accent }}>
      <span className="project-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="visual" aria-hidden="true">{project.slug}.sys</div>
      <h3><Link href={href} className="stretched">{pick(project.title, lang)}</Link></h3>
      <p className="meta">
        <span>{project.client === 'TODO' ? '—' : project.client}</span>
        <span>{project.location}</span>
        {project.year ? <span>{project.year}</span> : null}
      </p>
      <p className="prose" style={{ fontSize: '1rem' }}>{project.draft ? t(lang, 'projects.soon') : pick(project.summary, lang)}</p>
      {project.results.length ? (
        <ul className="results">
          {project.results.map((r) => (
            <li className="result" key={r.value + r.label.fr}><strong>{r.value}</strong><span>{pick(r.label, lang)}</span></li>
          ))}
        </ul>
      ) : null}
      {project.stack.length ? <ul className="chips">{project.stack.map((s) => <li className="chip" key={s}>{s}</li>)}</ul> : null}
      <span className="link-arrow" style={{ marginTop: 'auto' }}>{t(lang, 'projects.open')} →</span>
    </article>
  );
}
