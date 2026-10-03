'use client';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import { CATEGORIES, type Category, type Status } from '@/lib/schemas';
import { StatusBadge } from './StatusBadge';

export type ShowcaseItem = {
  slug: string; index: number; featured: boolean; title: string; client: string; location: string; year: number | null;
  status: Status; statusLabel: string; statusNote: string | null; summary: string;
  technical: { title: string; text: string }[]; results: { value: string; label: string }[];
  stack: string[]; categories: Category[]; accent: string; href: string; demo: string | null; repo: string | null; repoLabel: string | null;
  media: ReactNode;
};
export type ShowcaseLabels = {
  filters: Record<'all' | Category, string>; filterLabel: string; clearTech: string; techFilter: string; shown: string; open: string; visit: string;
  code: string; technical: string; others: string; allRepos: string; githubUrl: string; none: string; reset: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Section Projets : lignes éditoriales pour les projets mis en avant (maquette du site, réalisation technique, liens),
 * cartes compactes pour les autres. Filtres par catégorie et par technologie (chips cliquables).
 */
export function ProjectsShowcase({ items, labels }: { items: ShowcaseItem[]; labels: ShowcaseLabels }) {
  const [cat, setCat] = useState<'all' | Category>('all');
  const [tech, setTech] = useState<string | null>(null);

  const shown = useMemo(() => items.filter((i) => (cat === 'all' || i.categories.includes(cat)) && (!tech || i.stack.includes(tech))), [items, cat, tech]);
  const available = useMemo(() => new Set(items.flatMap((i) => i.categories)), [items]);
  const featured = shown.filter((i) => i.featured);
  const others = shown.filter((i) => !i.featured);
  const filterKey = `${cat}|${tech ?? ''}`;

  const chips = (it: ShowcaseItem) => (
    <ul className="chips">
      {it.stack.map((s) => (
        <li key={s}>
          <button type="button" className="chip chip-btn" aria-pressed={tech === s} aria-label={`${labels.techFilter} ${s}`} onClick={() => setTech((cur) => (cur === s ? null : s))}>{s}</button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="showcase">
      <div className="wrap">
        <div className="filters-bar">
          <div className="filters" role="group" aria-label={labels.filterLabel}>
            {(['all', ...CATEGORIES] as const).filter((c) => c === 'all' || available.has(c)).map((c) => (
              <button key={c} type="button" className="chip chip-btn" aria-pressed={cat === c} onClick={() => setCat(c)}>{labels.filters[c]}</button>
            ))}
            {tech ? <button type="button" className="chip chip-btn chip-active" onClick={() => setTech(null)} aria-label={`${labels.clearTech} : ${tech}`}>{tech} ×</button> : null}
          </div>
          <p className="muted mono" style={{ fontSize: '0.8rem' }} aria-live="polite">{pad(shown.length)} / {pad(items.length)}<span className="sr-only"> {labels.shown}</span></p>
        </div>

        {shown.length === 0 ? (
          <p className="glass prose">{labels.none} <button type="button" className="link-arrow" style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => { setCat('all'); setTech(null); }}>{labels.reset}</button></p>
        ) : null}

        {featured.map((it, i) => (
          <article key={`${it.slug}-${filterKey}`} className={`pj${i % 2 ? ' is-flip' : ''}`} style={{ ['--accent' as string]: it.accent }}>
            <div className="pj-media">
              <Link href={it.href} tabIndex={-1} aria-hidden="true" className="pj-media-link" data-cursor="open">{it.media}</Link>
            </div>
            <div className="pj-body">
              <div className="pj-top">
                <span className="pj-num" aria-hidden="true">{pad(it.index + 1)}</span>
                <StatusBadge status={it.status} label={it.statusLabel} note={it.statusNote} />
              </div>
              <h3 className="pj-title"><Link href={it.href}>{it.title}</Link></h3>
              <p className="meta">
                {it.client ? <span>{it.client}</span> : null}
                {it.location ? <span>{it.location}</span> : null}
                {it.year ? <span>{it.year}</span> : null}
              </p>
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
              <div className="pj-actions">
                {it.demo ? <a className="btn btn-gold btn-sm" href={it.demo} target="_blank" rel="noopener" data-track="demo-click">{labels.visit} ↗</a> : null}
                {it.repo ? <a className="btn btn-line btn-sm" href={it.repo} target="_blank" rel="noopener" data-track="github-click">{labels.code} ↗</a> : null}
                <Link className="link-arrow" href={it.href}>{labels.open} →</Link>
              </div>
              {it.repo && it.repoLabel ? <p className="pj-note muted">{it.repoLabel}</p> : null}
            </div>
          </article>
        ))}

        {others.length ? (
          <section className="pj-others" aria-labelledby="pj-others-title">
            <h3 id="pj-others-title" className="pj-others-title">{labels.others}</h3>
            <ul className="pj-grid">
              {others.map((it) => (
                <li key={`${it.slug}-${filterKey}`}>
                  <article className="panel pj-card" style={{ ['--accent' as string]: it.accent }}>
                    <div className="pj-top">
                      <span className="pj-num pj-num-sm" aria-hidden="true">{pad(it.index + 1)}</span>
                      <StatusBadge status={it.status} label={it.statusLabel} note={it.statusNote} />
                    </div>
                    <h4 className="pj-card-title"><Link href={it.href}>{it.title}</Link></h4>
                    <p className="meta">
                      {it.client ? <span>{it.client}</span> : null}
                      {it.location ? <span>{it.location}</span> : null}
                      {it.year ? <span>{it.year}</span> : null}
                    </p>
                    <p className="pj-card-summary">{it.summary}</p>
                    {chips(it)}
                    <div className="pj-actions">
                      {it.demo ? <a className="btn btn-gold btn-sm" href={it.demo} target="_blank" rel="noopener" data-track="demo-click">{labels.visit} ↗</a> : null}
                      {it.repo ? <a className="btn btn-line btn-sm" href={it.repo} target="_blank" rel="noopener" data-track="github-click">{labels.code} ↗</a> : null}
                      <Link className="link-arrow" href={it.href}>{labels.open} →</Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <p className="mt-6"><a className="link-arrow" href={labels.githubUrl} target="_blank" rel="noopener" data-track="github-click">{labels.allRepos} ↗</a></p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
