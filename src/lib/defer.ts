/**
 * Exécute `fn` une seule fois, hors du chemin critique : à la première interaction (défilement, toucher, clavier…)
 * ou, au plus tard, `delay` ms après le chargement de la page. Retourne une fonction d'annulation.
 * Sert à repousser le moteur d'animation (GSAP, Lenis, ScrollTrigger) après la première peinture et l'hydratation.
 */
export function whenIdleOrInteract(fn: () => void, delay = 1500): () => void {
  let done = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let idle = 0;
  const events: (keyof WindowEventMap)[] = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'];
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };

  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, run));
    window.removeEventListener('load', arm);
    if (timer) clearTimeout(timer);
    if (idle) w.cancelIdleCallback?.(idle);
  };
  const run = () => {
    if (done) return;
    done = true;
    cleanup();
    fn();
  };
  const arm = () => {
    if (done) return;
    timer = setTimeout(() => { idle = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 1000 }) : 0; if (!idle) run(); }, delay);
  };

  events.forEach((e) => window.addEventListener(e, run, { passive: true, once: true }));
  if (document.readyState === 'complete') arm(); else window.addEventListener('load', arm, { once: true });
  return () => { done = true; cleanup(); };
}
