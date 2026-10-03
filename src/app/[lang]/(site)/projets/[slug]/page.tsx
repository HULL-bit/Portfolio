import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCALES, isLang } from '@/lib/i18n';
import { getProject, pick, profile, projects, t } from '@/lib/content';
import { abs, localePath, pageMeta } from '@/lib/site';
import { ProjectMedia } from '@/components/projects/ProjectMedia';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { ArchitectureDiagram } from '@/components/projects/ArchitectureDiagram';
import { ResultValue } from '@/components/projects/ResultValue';
import { StatusBadge } from '@/components/projects/StatusBadge';
import { InView } from '@/components/ui/InView';

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
    description: `${pick(p.summary, lang)} ${p.stack.slice(0, 6).join(', ')}.`,
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
  const meta = [project.client, project.location, project.year ? String(project.year) : ''].filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: pick(project.title, lang),
    description: pick(project.summary, lang),
    url: abs(localePath(lang, `projets/${project.slug}/`)),
    inLanguage: lang,
    keywords: project.stack.join(', '),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    author: { '@type': 'Person', name: profile.name, url: abs(localePath(lang)) },
    ...(project.demo ? { sameAs: [project.demo] } : {}),
    ...(project.repo ? { codeRepository: project.repo } : {}),
  };

  return (
    <article className="project-page" style={{ ['--accent' as string]: project.accent }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="project-hero">
        <div className="wrap">
          <Link href={`${localePath(lang)}#projects`} className="link-arrow">← {label('back')}</Link>
          <span className="eyebrow mt-8">{`// ${String(idx + 1).padStart(2, '0')} — ${project.client || pick(project.role, lang)}`}</span>
          <h1 className="project-title">{pick(project.title, lang)}</h1>
          <div className="project-meta">
            <StatusBadge status={project.status} label={label(`status.${project.status}`)} note={project.statusNote ? pick(project.statusNote, lang) : null} />
            {meta.length ? <p className="meta">{meta.map((m) => <span key={m}>{m}</span>)}</p> : null}
          </div>
          <p className="project-lead prose">{pick(project.summary, lang)}</p>
          <div className="pj-actions" style={{ marginTop: '1.6rem' }}>
            {project.demo ? <a className="btn btn-gold" href={project.demo} target="_blank" rel="noopener" data-track="demo-click">{label('visit')} ↗</a> : null}
            {project.repo ? <a className="btn btn-line" href={project.repo} target="_blank" rel="noopener" data-track="github-click">{label('code')} ↗</a> : null}
          </div>
          {project.repo && project.repoLabel ? <p className="pj-note muted">{pick(project.repoLabel, lang)}</p> : null}
          <div className="project-visual mt-10"><ProjectMedia project={project} lang={lang} sizes="(min-width: 1100px) 1100px, 94vw" eager /></div>
        </div>
      </header>

      <div className="wrap" style={{ paddingBottom: '6rem' }}>
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

          {project.technical.length ? (
            <section className="col-span-12" aria-labelledby="tech-title">
              <h2 id="tech-title" className="pj-others-title" style={{ marginTop: '1.5rem' }}>{label('technical')}</h2>
              <ul className="tech-grid">
                {project.technical.map((x) => (
                  <li key={x.title.fr} className="glass">
                    <h3 className="tech-card-title">{pick(x.title, lang)}</h3>
                    <p className="prose" style={{ fontSize: '1rem' }}>{pick(x.text, lang)}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

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
              <InView />
              <span className="card-label">{label('architecture')}</span>
              <ArchitectureDiagram architecture={project.architecture} title={pick(project.title, lang)} />
              <ul className="sr-only">
                {project.architecture.links.map((l) => <li key={l.from + l.to}>{names.get(l.from)} → {names.get(l.to)}</li>)}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="pj-actions" style={{ marginTop: '2rem' }}>
          {project.demo ? <a className="btn btn-gold" href={project.demo} target="_blank" rel="noopener" data-track="demo-click">{label('visit')} ↗</a> : null}
          {project.repo ? <a className="btn btn-line" href={project.repo} target="_blank" rel="noopener" data-track="github-click">{label('code')} ↗</a> : null}
          <a className="link-arrow" href={profile.contact.github} target="_blank" rel="noopener" data-track="github-click">{label('allRepos')} ↗</a>
        </div>

        <nav className="pager" style={{ marginTop: '4rem' }} aria-label="Projets">
          <Link className="glass" href={localePath(lang, `projets/${prev.slug}/`)} data-cursor="open"><small>← {label('prev')}</small><strong>{pick(prev.title, lang)}</strong><div className="pager-preview" aria-hidden="true"><ProjectVisual project={prev} title={pick(prev.title, lang)} /></div></Link>
          <Link className="glass" href={localePath(lang, `projets/${next.slug}/`)} data-cursor="open"><small>{label('next')} →</small><strong>{pick(next.title, lang)}</strong><div className="pager-preview" aria-hidden="true"><ProjectVisual project={next} title={pick(next.title, lang)} /></div></Link>
        </nav>
      </div>
    </article>
  );
}
