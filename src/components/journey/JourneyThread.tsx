'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Motif } from '@/components/ui/Motif';
import { prefersReduced } from '@/lib/motion';

type Geo = { h: number; d: string; pts: { x: number; y: number }[] };

/**
 * Fil brodé : un tracé lumineux (DrawSVG, scrub) relie les étapes du parcours ; à chaque étape une rosace s'allume.
 * Sans JS ou en reduced-motion, la frise statique (CSS) reste affichée.
 */
export function JourneyThread() {
  const anchor = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReduced()) return;
    const wrap = anchor.current?.parentElement;
    const list = wrap?.querySelector('ol');
    if (!wrap || !list) return;
    const build = () => {
      const base = wrap.getBoundingClientRect().top;
      const steps = Array.from(list.querySelectorAll<HTMLElement>(':scope > li'));
      const pts = steps.map((s, i) => { const r = s.getBoundingClientRect(); return { x: i % 2 ? 40 : 22, y: r.top - base + Math.min(34, r.height / 2) }; });
      if (pts.length < 2) return;
      let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]!, b = pts[i]!, m = (a.y + b.y) / 2;
        d += ` C ${a.x} ${m}, ${b.x} ${m}, ${b.x} ${b.y}`;
      }
      setGeo({ h: wrap.offsetHeight, d, pts });
      wrap.classList.add('thread-live');
    };
    const t = setTimeout(build, 80);
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);
    return () => { clearTimeout(t); ro.disconnect(); wrap.classList.remove('thread-live'); };
  }, [pathname]);

  useEffect(() => {
    if (!geo || !line.current) return;
    let kill = () => {};
    let off = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/DrawSVGPlugin')]);
      if (off || !anchor.current) return;
      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
      const wrap = anchor.current.parentElement!;
      const ctx = gsap.context(() => {
        gsap.fromTo(line.current, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 65%', end: 'bottom 75%', scrub: 0.6 } });
        anchor.current!.querySelectorAll<HTMLElement>('.thread-rose').forEach((rose, i) => {
          const step = wrap.querySelectorAll('ol > li')[i];
          if (step) ScrollTrigger.create({ trigger: step, start: 'top 70%', onEnter: () => rose.classList.add('lit'), onLeaveBack: () => rose.classList.remove('lit') });
        });
      });
      kill = () => ctx.revert();
    })();
    return () => { off = true; kill(); };
  }, [geo]);

  return (
    <div ref={anchor} className="thread" aria-hidden="true">
      {geo ? (
        <>
          <svg ref={svg} width={64} height={geo.h} viewBox={`0 0 64 ${geo.h}`} fill="none">
            <path d={geo.d} className="thread-ghost" />
            <path ref={line} d={geo.d} className="thread-line" />
          </svg>
          {geo.pts.map((p, i) => (
            <span key={i} className="thread-rose" style={{ left: p.x - 22, top: p.y - 22 }}>
              <Motif name="rosace" variant="circuit" simple />
            </span>
          ))}
        </>
      ) : null}
    </div>
  );
}
