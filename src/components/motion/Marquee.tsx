'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { prefersReduced } from '@/lib/motion';
import { runtime } from '@/lib/runtime';

type Props = { rows: ReactNode[]; label: string };

/**
 * Deux bandeaux infinis en sens opposés. La vitesse et l'inclinaison (skew) suivent la vélocité du scroll Lenis.
 * Sans JS ou en reduced-motion : liste statique qui passe à la ligne.
 */
export function Marquee({ rows, label }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReduced()) return;
    el.classList.add('is-live');
    const rowsEl = Array.from(el.querySelectorAll<HTMLElement>('.marquee-row'));
    const tracks = Array.from(el.querySelectorAll<HTMLElement>('.marquee-track'));
    const state = tracks.map((t, i) => ({ t, x: 0, dir: i % 2 === 0 ? -1 : 1, base: i % 2 === 0 ? 55 : 42, w: 0 }));
    const measure = () => state.forEach((s) => { s.w = (s.t.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0; if (s.dir > 0) s.x = -s.w; });
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; }, { rootMargin: '100px' });
    io.observe(el);
    let skew = 0;
    let lastSkew = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      const v = runtime.velocity;
      const boost = 1 + Math.min(Math.abs(v), 40) * 0.22;
      const targetSkew = Math.max(-9, Math.min(9, -v * 0.45));
      skew += (targetSkew - skew) * 0.12;
      state.forEach((s) => {
        if (!s.w) return;
        s.x += s.dir * s.base * boost * dt;
        if (s.dir < 0 && s.x <= -s.w) s.x += s.w;
        if (s.dir > 0 && s.x >= 0) s.x -= s.w;
        s.t.style.transform = `translate3d(${s.x}px,0,0)`;
      });
      if (Math.abs(skew) > 0.02 || lastSkew !== 0) {
        rowsEl.forEach((r) => { r.style.transform = `skewX(${skew.toFixed(2)}deg)`; });
        lastSkew = Math.abs(skew) > 0.02 ? skew : 0;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', measure); el.classList.remove('is-live'); };
  }, []);

  return (
    <div ref={root} className="marquee" role="list" aria-label={label}>
      {rows.map((row, i) => (
        <div className="marquee-row" key={i}>
          <div className="marquee-track">
            <div className="marquee-set">{row}</div>
            <div className="marquee-set marquee-clone" aria-hidden="true">{row}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
