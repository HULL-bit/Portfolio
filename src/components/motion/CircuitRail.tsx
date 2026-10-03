'use client';
import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '@/lib/motion';

type Geo = { h: number; d: string; pads: { x: number; y: number; section: string }[] };
const X = [12, 30];

/**
 * Piste de circuit dans la marge gauche : relie les sections, se dessine au scroll (DrawSVG, scrub)
 * et allume une pastille de soudure à chaque section atteinte. Décoratif, desktop large uniquement.
 */
export function CircuitRail() {
  const [geo, setGeo] = useState<Geo | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
    build();
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(build, 250); };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.getElementById('main')!);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); ro.disconnect(); };
  }, []);

  useEffect(() => {
    if (!geo || !pathRef.current || !svgRef.current) return;
    let kill = () => {};
    let off = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/DrawSVGPlugin')]);
      if (off) return;
      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
      const ctx = gsap.context(() => {
        gsap.fromTo(pathRef.current, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: '#main', start: 'top 70%', end: 'bottom bottom', scrub: 0.7 } });
        svgRef.current!.querySelectorAll<SVGCircleElement>('.rail-pad').forEach((pad) => {
          ScrollTrigger.create({ trigger: `#${pad.dataset.section}`, start: 'top 62%', onEnter: () => pad.classList.add('lit'), onLeaveBack: () => pad.classList.remove('lit') });
        });
      });
      kill = () => ctx.revert();
    })();
    return () => { off = true; kill(); };
  }, [geo]);

  if (!geo) return null;
  return (
    <svg ref={svgRef} className="rail" width={44} height={geo.h} viewBox={`0 0 44 ${geo.h}`} aria-hidden="true" focusable="false">
      <path className="rail-ghost" d={geo.d} />
      <path ref={pathRef} className="rail-line" d={geo.d} />
      {geo.pads.map((p) => <circle key={p.section} className="rail-pad" data-section={p.section} cx={p.x} cy={p.y} r={4.5} />)}
    </svg>
  );
}
