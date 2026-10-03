'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, domMax, m } from 'framer-motion';
import { FM_EASE, prefersReduced } from '@/lib/motion';
import { runtime } from '@/lib/runtime';
import { CATEGORIES, type Category } from '@/lib/schemas';
import { LiquidVisual } from './LiquidVisual';

export type RailItem = {
  slug: string; index: number; title: string; client: string; location: string; year: number | null; summary: string;
  categories: Category[]; accent: string; stack: string[]; results: { value: string; label: string }[]; draft: boolean; href: string;
};
type Labels = {
  filters: Record<'all' | Category, string>; open: string; soon: string; filterLabel: string; clearTech: string; shown: string; techFilter: string;
};

/**
 * Projets : défilement horizontal épinglé (un projet par écran) sur grand écran, pile verticale « sticky » sinon.
 * Filtres par catégorie (Framer Motion `layout`) et par technologie (chips cliquables). Le HTML serveur est la pile verticale.
 */
export default function ProjectsRail({ items, labels }: { items: RailItem[]; labels: Labels }) {
  const [cat, setCat] = useState<'all' | Category>('all');
  const [tech, setTech] = useState<string | null>(null);
  const [hmode, setHmode] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const trigger = useRef<{ start: number; end: number } | null>(null);

  const shown = useMemo(() => items.filter((i) => (cat === 'all' || i.categories.includes(cat)) && (!tech || i.stack.includes(tech))), [items, cat, tech]);
  const available = useMemo(() => new Set(items.flatMap((i) => i.categories)), [items]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px) and (hover: hover) and (pointer: fine)');
    const update = () => setHmode(mq.matches && !prefersReduced());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // ── défilement horizontal épinglé : reconstruit à chaque changement de filtre ──
  useEffect(() => {
    const trackEl = track.current;
    if (!hmode || !wrap.current || !trackEl) return;
    let kill = () => {};
    let off = false;
    const timer = setTimeout(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (off || !wrap.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const t = track.current;
      const w = wrap.current;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      if (dist() <= 2) return;
      const n = shown.length;
      const ctx = gsap.context(() => {
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: w, pin: true, scrub: 0.8, start: 'top top', end: () => `+=${dist() * 1.05}`, invalidateOnRefresh: true, anticipatePin: 1,
            onRefresh: (self) => { trigger.current = { start: self.start, end: self.end }; },
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              if (counter.current) counter.current.textContent = `${String(Math.round(self.progress * (n - 1)) + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
            },
          },
        });
        t.querySelectorAll<HTMLElement>('.panel').forEach((panel) => {
          const num = panel.querySelector<HTMLElement>('.project-num');
          const vis = panel.querySelector<HTMLElement>('.liquid');
          if (num) gsap.fromTo(num, { color: 'rgba(5,6,10,0)' }, { color: panel.style.getPropertyValue('--accent') || '#3D5AFE', ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 78%', end: 'left 30%', scrub: true } });
          if (vis) gsap.fromTo(vis, { xPercent: 7 }, { xPercent: -7, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
      }, w);
      ScrollTrigger.refresh();
      kill = () => { ctx.revert(); trigger.current = null; };
    }, 320);
    return () => { off = true; clearTimeout(timer); kill(); trackEl.style.transform = ''; };
  }, [hmode, shown]);

  // clavier : donner le focus à un panneau hors écran fait défiler jusqu'à lui
  const onFocus = useCallback((i: number) => {
    const st = trigger.current;
    if (!hmode || !st || shown.length < 2) return;
    runtime.lenis?.scrollTo(st.start + (i / (shown.length - 1)) * (st.end - st.start), { duration: 1 });
  }, [hmode, shown.length]);

  const changeCat = (c: 'all' | Category) => {
    setCat(c);
    if (hmode && trigger.current) {
      if (runtime.lenis) runtime.lenis.scrollTo(trigger.current.start, { immediate: true });
      else window.scrollTo(0, trigger.current.start);
    }
  };

  return (
    <LazyMotion features={domMax} strict>
      <div className={`projects-rail${hmode ? ' hmode' : ''}`}>
        <div ref={wrap} className="hscroll">
          <div className="hscroll-bar wrap">
            <div className="filters" role="group" aria-label={labels.filterLabel}>
              {(['all', ...CATEGORIES] as const).filter((c) => c === 'all' || available.has(c)).map((c) => (
                <button key={c} type="button" className="chip chip-btn" aria-pressed={cat === c} onClick={() => changeCat(c)}>{labels.filters[c]}</button>
              ))}
              {tech ? <button type="button" className="chip chip-btn chip-active" onClick={() => setTech(null)} aria-label={`${labels.clearTech} : ${tech}`}>{tech} ×</button> : null}
            </div>
            {hmode ? (
              <div className="hscroll-meta" aria-hidden="true">
                <span ref={counter} className="mono">{`01 / ${String(shown.length).padStart(2, '0')}`}</span>
                <div className="hbar"><i ref={bar as React.RefObject<HTMLElement>} /></div>
              </div>
            ) : null}
          </div>
          <div ref={track} className="track">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((it, i) => (
                <m.article
                  key={it.slug}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: FM_EASE.out }}
                  className="panel project-panel"
                  style={{ ['--accent' as string]: it.accent, ['--i' as string]: i }}
                  data-cursor="open"
                  onFocusCapture={() => onFocus(i)}
                >
                  <div className="panel-copy">
                    <span className="project-num" aria-hidden="true">{String(it.index + 1).padStart(2, '0')}</span>
                    <h3><Link href={it.href} className="stretched">{it.title}</Link></h3>
                    <p className="meta"><span>{it.client === 'TODO' ? '—' : it.client}</span><span>{it.location}</span>{it.year ? <span>{it.year}</span> : null}</p>
                    <p className="prose" style={{ fontSize: '1.02rem' }}>{it.draft ? labels.soon : it.summary}</p>
                    {it.results.length ? (
                      <ul className="results">{it.results.map((r) => <li className="result" key={r.value + r.label}><strong>{r.value}</strong><span>{r.label}</span></li>)}</ul>
                    ) : null}
                    {it.stack.length ? (
                      <ul className="chips">
                        {it.stack.map((s) => (
                          <li key={s}><button type="button" className="chip chip-btn" aria-pressed={tech === s} aria-label={`${labels.techFilter} ${s}`} onClick={() => setTech((cur) => (cur === s ? null : s))}>{s}</button></li>
                        ))}
                      </ul>
                    ) : null}
                    <span className="link-arrow">{labels.open} →</span>
                  </div>
                  <div className="panel-visual"><LiquidVisual project={it} title={it.title} /></div>
                </m.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{shown.length} / {items.length} {labels.shown}</p>
      </div>
    </LazyMotion>
  );
}
