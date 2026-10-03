import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCALES, isLang } from '@/lib/i18n';
import { getProject, pick, projects, t } from '@/lib/content';
import { localePath, pageMeta } from '@/lib/site';
import { LiquidVisual } from '@/components/projects/LiquidVisual';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { ArchitectureDiagram } from '@/components/projects/ArchitectureDiagram';
import { ResultValue } from '@/components/projects/ResultValue';

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!isLang(lang) || !p) return {};
  return pageMeta({
    lang, path: `projets/${slug}/`, og: `projet-${slug}`, siteName: t(lang, 'meta.siteName'),
    title: `${pick(p.title, lang)} — ${t(lang, 'meta.projectSuffix')}`,
    description: p.draft ? pick(p.title, lang) : `${pick(p.summary, lang)} ${p.stack.join(', ')}.`,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { lang, slug } = await params;
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  if (!isLang(lang) || !project) notFound();
  const prev = projects[(idx - 1 + projects.length) % projects.length]!;
  const next = projects[(idx + 1) % projects.length]!;
  const label = (n: string) => t(lang, `projects.${n}`);
  const names = new Map(project.architecture.nodes.map((n) => [n.id, n.label]));

  return (
    <article style={{ ['--accent' as string]: project.accent }}>
      <header className="project-hero">
        <div className="wrap">
          <Link href={`${localePath(lang)}#projects`} className="link-arrow">← {label('back')}</Link>
          <span className="eyebrow mt-8">{`// ${String(idx + 1).padStart(2, '0')} — ${project.client === 'TODO' ? project.slug : project.client}`}</span>
          <h1 className="project-title">{pick(project.title, lang)}</h1>
          <p className="meta mt-6">
            <span>{project.location}</span>{project.year ? <span>{project.year}</span> : null}
            <span>{project.categories.map((c) => t(lang, `projects.filters.${c}`)).join(' · ')}</span>
          </p>
          <div className="project-visual mt-10"><LiquidVisual project={project} title={pick(project.title, lang)} /></div>
        </div>
      </header>

      <div className="wrap" style={{ paddingBottom: '6rem' }}>
        {project.draft ? (
          <p className="glass prose">{label('soon')}</p>
        ) : (
          <div className="grid12">
            <section className="glass col-span-12 lg:col-span-7">
              <span className="card-label">{label('context')}</span>
              <div className="prose"><p>{pick(project.context, lang)}</p></div>
              <span className="card-label mt-8">{label('mission')}</span>
              <div className="prose"><p>{pick(project.mission, lang)}</p></div>
            </section>
            <section className="glass col-span-12 lg:col-span-5">
              <span className="card-label">{label('role')}</span>
              <p>{pick(project.role, lang)}</p>
              <span className="card-label mt-8">{label('stack')}</span>
              <ul className="chips">{project.stack.map((s) => <li className="chip" key={s}>{s}</li>)}</ul>
            </section>
            <section className="glass col-span-12 lg:col-span-7">
              <span className="card-label">{label('actions')}</span>
              <ul className="bullets">{project.actions.map((a) => <li key={a.fr}>{pick(a, lang)}</li>)}</ul>
              {project.features.length ? (
                <>
                  <span className="card-label mt-8">{label('features')}</span>
                  <ul className="bullets">{project.features.map((f) => <li key={f.fr}>{pick(f, lang)}</li>)}</ul>
                </>
              ) : null}
            </section>
            <section className="glass col-span-12 lg:col-span-5">
              <span className="card-label">{label('results')}</span>
              {project.results.length ? (
                <ul className="results">{project.results.map((r) => <li className="result" key={r.value}><strong><ResultValue value={r.value} /></strong><span>{pick(r.label, lang)}</span></li>)}</ul>
              ) : <p className="muted">—</p>}
            </section>
            {project.architecture.nodes.length ? (
              <section className="glass col-span-12">
                <span className="card-label">{label('architecture')}</span>
                <ArchitectureDiagram architecture={project.architecture} title={pick(project.title, lang)} />
                <ul className="sr-only">
                  {project.architecture.links.map((l) => <li key={l.from + l.to}>{names.get(l.from)} → {names.get(l.to)}</li>)}
                </ul>
              </section>
            ) : null}
          </div>
        )}
        <div className="cta" style={{ marginTop: '2rem' }}>
          {project.repo ? <a className="btn btn-line" href={project.repo} rel="noopener" data-track="github-click">{label('repo')} ↗</a> : null}
          {project.demo ? <a className="btn btn-gold" href={project.demo} rel="noopener">{label('demo')} ↗</a> : null}
          {project.private ? <span className="chip">{label('private')}</span> : null}
        </div>
        <nav className="pager" style={{ marginTop: '4rem' }} aria-label="Projets">
          <Link className="glass" href={localePath(lang, `projets/${prev.slug}/`)} data-cursor="open"><small>← {label('prev')}</small><strong>{pick(prev.title, lang)}</strong><div className="pager-preview" aria-hidden="true"><ProjectVisual project={prev} title={pick(prev.title, lang)} /></div></Link>
          <Link className="glass" href={localePath(lang, `projets/${next.slug}/`)} data-cursor="open"><small>{label('next')} →</small><strong>{pick(next.title, lang)}</strong><div className="pager-preview" aria-hidden="true"><ProjectVisual project={next} title={pick(next.title, lang)} /></div></Link>
        </nav>
      </div>
    </article>
  );
}
