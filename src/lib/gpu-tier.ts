export type Tier = 'high' | 'mid' | 'low';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

/** FPS moyen mesuré sur les `frames` premières images (rAF). */
function measureFps(frames = 60): Promise<number> {
  return new Promise((resolve) => {
    let n = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      if (++n >= frames) return resolve((n - 1) / ((now - start) / 1000));
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const down = (t: Tier): Tier => (t === 'high' ? 'mid' : 'low');
let cached: Promise<Tier> | null = null;

/**
 * Classe l'appareil : WebGL2, mémoire, cœurs, pointeur tactile, puis FPS mesuré.
 * high = tout · mid = moins de particules, pas de post-traitement · low = aucun WebGL (replis HTML/CSS).
 */
export function getGpuTier(): Promise<Tier> {
  if (typeof window === 'undefined') return Promise.resolve('low');
  cached ??= (async () => {
    if (!hasWebGL2()) return 'low';
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let tier: Tier = coarse ? (memory <= 3 || cores <= 4 ? 'low' : 'mid') : memory < 4 || cores < 4 ? 'mid' : 'high';
    if (tier === 'low') return tier;
    const fps = await measureFps();
    if (fps < 20) return 'low';
    if (fps < 40) tier = down(tier);
    return tier;
  })();
  return cached;
}
