'use client';
import { useEffect, useRef } from 'react';

/** Barre de progression de lecture (dégradé indigo → or), indépendante du moteur d'animation. */
export function ReadingProgress({ label }: { label: string }) {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="progress" role="progressbar" aria-label={label} aria-hidden="true">
      <i ref={bar as React.RefObject<HTMLElement>} />
    </div>
  );
}
