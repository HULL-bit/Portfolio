import type Lenis from 'lenis';

/** Instance Lenis partagée (créée par MotionProvider). */
export const runtime: { lenis: Lenis | null; velocity: number } = { lenis: null, velocity: 0 };

/** Défile vers une ancre (Lenis si dispo, sinon natif). */
export function scrollToTarget(target: string | HTMLElement, offset = -72) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (runtime.lenis) runtime.lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
