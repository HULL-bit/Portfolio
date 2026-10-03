'use client';
import { useEffect, useRef } from 'react';
import { finePointer, prefersReduced } from '@/lib/motion';

type Labels = { view: string; open: string; drag: string };

/** Curseur personnalisé (pointeur fin uniquement) : point + anneau élastique + traînée cyan discrète. */
export function Cursor({ labels }: { labels: Labels }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!finePointer() || prefersReduced()) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const trailPos = Array.from({ length: 6 }, () => ({ x: -100, y: -100 }));
    const trailEls = trail.current ? Array.from(trail.current.children) as HTMLElement[] : [];
    let target: HTMLElement | null = null;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX; pos.y = e.clientY;
      if (!visible) { visible = true; ringPos.x = pos.x; ringPos.y = pos.y; root.classList.add('cursor-on'); }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, summary, [data-cursor], input, textarea, [role="button"]') ?? null;
      if (el !== target) {
        target = el;
        const key = el?.dataset.cursor as keyof Labels | undefined;
        const label = key ? labels[key] : '';
        if (text.current) text.current.textContent = label ?? '';
        ring.current?.classList.toggle('is-link', !!el);
        ring.current?.classList.toggle('has-label', !!label);
      }
    };
    const onLeave = () => { visible = false; root.classList.remove('cursor-on'); };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      let tx = pos.x, ty = pos.y;
      // l'anneau « aspire » les éléments magnétiques / boutons
      const magnet = target && (target.matches('[data-magnetic], .btn') ? target : null);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        tx = pos.x + (r.left + r.width / 2 - pos.x) * 0.35;
        ty = pos.y + (r.top + r.height / 2 - pos.y) * 0.35;
      }
      ringPos.x += (tx - ringPos.x) * 0.18;
      ringPos.y += (ty - ringPos.y) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
      let px = pos.x, py = pos.y;
      trailPos.forEach((p, i) => {
        p.x += (px - p.x) * (0.34 - i * 0.04);
        p.y += (py - p.y) * (0.34 - i * 0.04);
        const el = trailEls[i];
        if (el) el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
        px = p.x; py = p.y;
      });
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      root.classList.remove('has-cursor', 'cursor-on');
    };
  }, [labels]);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={trail} className="cursor-trail">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ opacity: 0.32 - i * 0.045 }} />)}</div>
      <div ref={ring} className="cursor-ring"><span ref={text} /></div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
