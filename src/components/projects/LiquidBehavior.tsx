'use client';
import { useEffect } from 'react';
import { prefersReduced } from '@/lib/motion';

/**
 * Îlot client : distorsion liquide au survol (feTurbulence + feDisplacementMap animés) et léger parallaxe interne,
 * pour tous les `.liquid` de la page. Le HTML/SVG est rendu côté serveur ; seuls les pointeurs avec survol sont concernés.
 */
export function LiquidBehavior() {
  useEffect(() => {
    if (prefersReduced() || !window.matchMedia('(hover: hover)').matches) return;
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('.liquid').forEach((el) => {
      const svg = el.querySelector<SVGElement>('svg.vis');
      const turb = el.querySelector<SVGFETurbulenceElement>('feTurbulence');
      const disp = el.querySelector<SVGFEDisplacementMapElement>('feDisplacementMap');
      const filterId = el.querySelector('filter')?.id;
      if (!svg || !turb || !disp || !filterId) return;
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
          svg.style.filter = `url(#${filterId})`;
          turb.setAttribute('baseFrequency', `${(0.006 + cur * 0.006 + Math.sin(t * 1.3) * 0.0012).toFixed(5)} ${(0.012 + Math.cos(t) * 0.002).toFixed(5)}`);
          disp.setAttribute('scale', (cur * 46).toFixed(2));
        } else if (svg.style.filter) svg.style.filter = '';
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
      cleanups.push(() => { cancelAnimationFrame(raf); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); el.removeEventListener('pointermove', move); });
    });
    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
