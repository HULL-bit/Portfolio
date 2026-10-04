import type { ReactNode } from 'react';
import { withBase } from '@/lib/base';
import { CATEGORIES, type Category, type Status } from '@/lib/schemas';
import { LiquidBehavior } from './LiquidBehavior';
import { ProjectsFilter } from './ProjectsFilter';
import { StatusBadge } from './StatusBadge';

export type ShowcaseItem = {
  slug: string; index: number; featured: boolean; title: string; client: string; location: string; year: number | null;
  status: Status; statusLabel: string; statusNote: string | null; summary: string;
  technical: { title: string; text: string }[]; results: { value: string; label: string }[];
  stack: string[]; categories: Category[]; accent: string; href: string; demo: string | null; repo: string | null; repoLabel: string | null;
  media: ReactNode;
  /** Le média contient déjà un lien (ex. diagramme « ouvrir en grand ») : on ne l'enveloppe pas dans un second <a> (imbrication invalide). */
  mediaHasLink?: boolean;
};
export type ShowcaseLabels = {
  filters: Record<'all' | Category, string>; filterLabel: string; clearTech: string; techFilter: string; shown: string; open: string; visit: string;
  code: string; technical: string; others: string; allRepos: string; githubUrl: string; none: string; reset: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Section Projets, rendue entièrement côté serveur : lignes éditoriales pour les projets mis en avant (maquette du site,
 * réalisation technique, liens), cartes compactes pour les autres. Les filtres (catégorie, technologie) sont assurés par
 * l'îlot <ProjectsFilter /> qui bascule l'attribut `hidden` — le gros arbre HTML n'est donc jamais hydraté.
 */
export function ProjectsShowcase({ items, labels }: { items: ShowcaseItem[]; labels: ShowcaseLabels }) {
  const featured = items.filter((i) => i.featured);
  const others = items.filter((i) => !i.featured);
  const available = new Set(items.flatMap((i) => i.categories));

  const chips = (it: ShowcaseItem) => (
    <ul className="chips">
      {it.stack.map((s) => (
        <li key={s}>
          <button type="button" className="chip chip-btn" data-tech={s} aria-pressed="false" aria-label={`${labels.techFilter} ${s}`}>{s}</button>
        </li>
      ))}
    </ul>
  );
  const actions = (it: ShowcaseItem) => (
    <div className="pj-actions">
      {it.demo ? <a className="btn btn-gold btn-sm" href={it.demo} target="_blank" rel="noopener" data-track="demo-click">{labels.visit} ↗</a> : null}
      {it.repo ? <a className="btn btn-line btn-sm" href={it.repo} target="_blank" rel="noopener" data-track="github-click">{labels.code} ↗</a> : null}
      <a className="link-arrow" href={withBase(it.href)}>{labels.open} →</a>
    </div>
  );
  const meta = (it: ShowcaseItem) => (
    <p className="meta">
      {it.client ? <span>{it.client}</span> : null}
      {it.location ? <span>{it.location}</span> : null}
      {it.year ? <span>{it.year}</span> : null}
    </p>
  );

  return (
    <div className="showcase" data-showcase>
      <div className="wrap">
        <div className="filters-bar">
          <div className="filters" role="group" aria-label={labels.filterLabel}>
            {(['all', ...CATEGORIES] as const).filter((c) => c === 'all' || available.has(c)).map((c) => (
              <button key={c} type="button" className="chip chip-btn" data-cat={c} aria-pressed={c === 'all'}>{labels.filters[c]}</button>
            ))}
            <button type="button" className="chip chip-btn chip-active" data-clear data-label={labels.clearTech} hidden />
          </div>
          <p className="muted mono" style={{ fontSize: '0.8rem' }} aria-live="polite"><span data-count>{pad(items.length)}</span> / {pad(items.length)}<span className="sr-only"> {labels.shown}</span></p>
        </div>

        <p className="glass prose" data-empty hidden>{labels.none} <button type="button" className="link-arrow" data-reset style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }}>{labels.reset}</button></p>

        {featured.map((it, i) => (
          <article key={it.slug} className={`pj${i % 2 ? ' is-flip' : ''}`} data-pj data-cats={it.categories.join(' ')} data-stack={it.stack.join('|')} style={{ ['--accent' as string]: it.accent }}>
            <div className="pj-media">
              {it.mediaHasLink ? (
                <div className="pj-media-link">{it.media}</div>
              ) : (
                <a href={withBase(it.href)} tabIndex={-1} aria-hidden="true" className="pj-media-link" data-cursor="open">{it.media}</a>
              )}
            </div>
            <div className="pj-body">
              <div className="pj-top">
                <span className="pj-num" aria-hidden="true">{pad(it.index + 1)}</span>
                <StatusBadge status={it.status} label={it.statusLabel} note={it.statusNote} />
              </div>
              <h3 className="pj-title"><a href={withBase(it.href)}>{it.title}</a></h3>
              {meta(it)}
              <p className="pj-summary">{it.summary}</p>
              {it.technical.length ? (
                <div className="pj-tech">
                  <span className="card-label">{labels.technical}</span>
                  <ul>{it.technical.map((x) => <li key={x.title}><b>{x.title}</b> — {x.text}</li>)}</ul>
                </div>
              ) : null}
              {it.results.length ? (
                <ul className="results">{it.results.map((r) => <li className="result" key={r.value + r.label}><strong>{r.value}</strong><span>{r.label}</span></li>)}</ul>
              ) : null}
              {chips(it)}
              {actions(it)}
              {it.repo && it.repoLabel ? <p className="pj-note muted">{it.repoLabel}</p> : null}
            </div>
          </article>
        ))}

        {others.length ? (
          <section className="pj-others" data-others aria-labelledby="pj-others-title">
            <h3 id="pj-others-title" className="pj-others-title">{labels.others}</h3>
            <ul className="pj-grid">
              {others.map((it) => (
                <li key={it.slug} data-pj data-card data-cats={it.categories.join(' ')} data-stack={it.stack.join('|')}>
                  <article className="panel pj-card" style={{ ['--accent' as string]: it.accent }}>
                    <div className="pj-top">
                      <span className="pj-num pj-num-sm" aria-hidden="true">{pad(it.index + 1)}</span>
                      <StatusBadge status={it.status} label={it.statusLabel} note={it.statusNote} />
                    </div>
                    <h4 className="pj-card-title"><a href={withBase(it.href)}>{it.title}</a></h4>
                    {meta(it)}
                    <p className="pj-card-summary">{it.summary}</p>
                    {chips(it)}
                    {actions(it)}
                  </article>
                </li>
              ))}
            </ul>
            <p className="mt-6"><a className="link-arrow" href={labels.githubUrl} target="_blank" rel="noopener" data-track="github-click">{labels.allRepos} ↗</a></p>
          </section>
        ) : null}
      </div>
      <ProjectsFilter />
      <LiquidBehavior />
    </div>
  );
}
