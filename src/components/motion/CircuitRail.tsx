'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { prefersReduced } from '@/lib/motion';
import { whenIdleOrInteract } from '@/lib/defer';

type Geo = { h: number; d: string; pads: { x: number; y: number; section: string }[] };
const X = [12, 30];

/**
 * Piste de circuit dans la marge gauche : relie les sections, se révèle au scroll (scrub, transforms seulement)
 * et allume une pastille de soudure à chaque section atteinte. Décoratif, desktop large uniquement.
 */
export function CircuitRail() {
  const [geo, setGeo] = useState<Geo | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReduced() || !window.matchMedia('(min-width: 1180px)').matches) return;
    const build = () => {
      const main = document.getElementById('main');
      if (!main) return;
      const top = main.getBoundingClientRect().top + window.scrollY;
      const h = main.offsetHeight;
      const secs = Array.from(main.querySelectorAll<HTMLElement>(':scope > section[id]'));
      let d = `M ${X[0]} 0`;
      let x = X[0]!;
      const pads: Geo['pads'] = [];
      secs.forEach((s, i) => {
        const y = s.getBoundingClientRect().top + window.scrollY - top + 60;
        const nx = X[(i + 1) % 2]!;
        d += ` V ${Math.max(0, y - 18)} L ${nx} ${y} `;
        x = nx;
        pads.push({ x, y, section: s.id });
      });
      d += ` V ${h}`;
      setGeo({ h, d, pads });
    };
    setGeo(null);
    let started = false;
    const first = whenIdleOrInteract(() => { started = true; build(); }, 1600);
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { if (!started) return; clearTimeout(t); t = setTimeout(build, 250); };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    const mainEl = document.getElementById('main');
    if (mainEl) ro.observe(mainEl);
    return () => { first(); clearTimeout(t); window.removeEventListener('resize', onResize); ro.disconnect(); };
  }, [pathname]);

  useEffect(() => {
    const wrap = wrapRef.current, mask = maskRef.current, line = lineRef.current;
    if (!geo || !wrap || !mask || !line) return;
    let kill = () => {};
    let off = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (off) return;
      gsap.registerPlugin(ScrollTrigger);
      // Le tracé n'est pas redessiné : une fenêtre (masque) descend en `transform` pendant que son contenu remonte d'autant.
      // Deux calques composités, zéro rastérisation à chaque image.
      const H = geo.h;
      const place = (p: number) => {
        const y = Math.round(p * H);
        mask.style.transform = `translate3d(0, ${y - H}px, 0)`;
        line.style.transform = `translate3d(0, ${H - y}px, 0)`;
      };
      place(0);
      const ctx = gsap.context(() => {
        const prog = { p: 0 };
        gsap.to(prog, { p: 1, ease: 'none', onUpdate: () => place(prog.p), scrollTrigger: { trigger: '#main', start: 'top 70%', end: 'bottom bottom', scrub: 0.7 } });
        wrap.querySelectorAll<SVGCircleElement>('.rail-pad').forEach((pad) => {
          ScrollTrigger.create({ trigger: `#${pad.dataset.section}`, start: 'top 62%', onEnter: () => pad.classList.add('lit'), onLeaveBack: () => pad.classList.remove('lit') });
        });
      });
      kill = () => ctx.revert();
    })();
    return () => { off = true; kill(); };
  }, [geo]);

  if (!geo) return null;
  const box = { width: 44, height: geo.h, viewBox: `0 0 44 ${geo.h}`, focusable: 'false' as const };
  return (
    <div ref={wrapRef} className="rail" style={{ width: 44, height: geo.h }} aria-hidden="true">
      <svg className="rail-svg" {...box}><path className="rail-ghost" d={geo.d} /></svg>
      <div ref={maskRef} className="rail-mask">
        <svg ref={lineRef} className="rail-svg rail-line-svg" {...box}><path className="rail-line" d={geo.d} /></svg>
      </div>
      <svg className="rail-svg" {...box}>
        {geo.pads.map((p) => <circle key={p.section} className="rail-pad" data-section={p.section} cx={p.x} cy={p.y} r={4.5} />)}
      </svg>
    </div>
  );
}
