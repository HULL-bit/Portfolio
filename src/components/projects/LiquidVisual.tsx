'use client';
import { useEffect, useId, useRef } from 'react';
import { prefersReduced } from '@/lib/motion';
import { ProjectVisual } from './ProjectVisual';
import type { Project } from '@/lib/schemas';

type Props = { project: Pick<Project, 'slug' | 'categories' | 'accent' | 'stack'>; title: string; tag?: string };

/**
 * Visuel du projet : distorsion liquide au survol (feTurbulence + feDisplacementMap, animée) et léger parallaxe interne.
 * Repli SVG choisi plutôt qu'un plan WebGL par panneau : aucun canvas supplémentaire, même rendu sur tous les appareils.
 */
export function LiquidVisual({ project, title, tag }: Props) {
  const id = useId().replace(/:/g, '');
  const frame = useRef<HTMLDivElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el || prefersReduced() || !window.matchMedia('(hover: hover)').matches) return;
    const svg = el.querySelector<SVGElement>('svg.vis');
    let target = 0, cur = 0, raf = 0, t = 0;
    const px = { x: 0, y: 0, tx: 0, ty: 0 };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += 0.016;
      cur += (target - cur) * 0.075;
      px.x += (px.tx - px.x) * 0.08; px.y += (px.ty - px.y) * 0.08;
      el.style.setProperty('--px', px.x.toFixed(3));
      el.style.setProperty('--py', px.y.toFixed(3));
      if (cur > 0.004) {
        if (svg) svg.style.filter = `url(#liq-${id})`;
        turb.current?.setAttribute('baseFrequency', `${(0.006 + cur * 0.006 + Math.sin(t * 1.3) * 0.0012).toFixed(5)} ${(0.012 + Math.cos(t) * 0.002).toFixed(5)}`);
        disp.current?.setAttribute('scale', (cur * 46).toFixed(2));
      } else if (svg && svg.style.filter) svg.style.filter = '';
      if (cur < 0.004 && target === 0 && Math.abs(px.x) < 0.002) { cancelAnimationFrame(raf); raf = 0; }
    };
    const run = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const enter = () => { target = 1; run(); };
    const leave = () => { target = 0; px.tx = 0; px.ty = 0; run(); };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      px.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      run();
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointermove', move); };
  }, [id]);

  return (
    <div ref={frame} className="liquid" style={{ ['--accent' as string]: project.accent }}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id={`liq-${id}`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ProjectVisual className="vis" project={project} title={title} />
      {tag ? <span className="schematic-tag" aria-hidden="true">{tag}</span> : null}
    </div>
  );
}
