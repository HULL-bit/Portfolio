'use client';
import { useEffect, useRef } from 'react';

/** Ajoute la classe `in-view` au parent tant qu'il est visible : permet de ne lancer les animations décoratives qu'à l'écran. */
export function InView() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('in-view', !!e?.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} hidden />;
}
