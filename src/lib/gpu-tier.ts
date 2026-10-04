export type Tier = 'high' | 'mid' | 'low';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type GpuInfo = { webgl2: boolean; software: boolean; renderer: string };
const SOFTWARE = /swiftshader|llvmpipe|software|basic render|softpipe/i;

/**
 * Sonde WebGL2 dans un Web Worker (OffscreenCanvas) : en rendu logiciel, créer un contexte bloque ~1 s,
 * ce qui ne doit jamais arriver sur le thread principal.
 */
function probeInWorker(): Promise<GpuInfo | null> {
  return new Promise((resolve) => {
    if (typeof OffscreenCanvas === 'undefined' || typeof Worker === 'undefined') return resolve(null);
    const code = `self.onmessage=function(){try{var c=new OffscreenCanvas(1,1);var gl=c.getContext('webgl2');if(!gl){postMessage({webgl2:false,software:true,renderer:''});return}var e=gl.getExtension('WEBGL_debug_renderer_info');var r=e?String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';postMessage({webgl2:true,software:/${SOFTWARE.source}/i.test(r),renderer:r})}catch(x){postMessage({webgl2:false,software:true,renderer:''})}}`;
    let url = '';
    try {
      url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      const w = new Worker(url);
      const done = (v: GpuInfo | null) => { w.terminate(); URL.revokeObjectURL(url); resolve(v); };
      const timer = setTimeout(() => done(null), 4000);
      w.onmessage = (e: MessageEvent<GpuInfo>) => { clearTimeout(timer); done(e.data); };
      w.onerror = () => { clearTimeout(timer); done(null); };
      w.postMessage(0);
    } catch { resolve(null); }
  });
}

function probeOnMainThread(): GpuInfo {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return { webgl2: false, software: true, renderer: '' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { webgl2: true, software: SOFTWARE.test(r), renderer: r };
  } catch { return { webgl2: false, software: true, renderer: '' }; }
}

let info: Promise<GpuInfo> | null = null;
const gpuInfo = (): Promise<GpuInfo> => (info ??= probeInWorker().then((r) => r ?? probeOnMainThread()));

export type GpuOverride = 'force' | 'low' | null;
const OVERRIDE_KEY = 'diaw:gpu';

/**
 * Choix manuel de la qualité 3D : `?gpu=force` / `?gpu=low` dans l'URL, ou la valeur mémorisée (commande `gpu on|off|auto`
 * du terminal). `force` active la 3D même sur un rendu logiciel ; `low` coupe tout le WebGL (replis HTML/CSS).
 */
export function gpuOverride(): GpuOverride {
  try {
    const q = new URLSearchParams(location.search).get('gpu');
    const v = q ?? localStorage.getItem(OVERRIDE_KEY);
    return v === 'force' || v === 'low' ? v : null;
  } catch { return null; }
}
export function setGpuOverride(v: GpuOverride) {
  try { if (v) localStorage.setItem(OVERRIDE_KEY, v); else localStorage.removeItem(OVERRIDE_KEY); } catch { /* stockage indisponible */ }
}
const forced = () => gpuOverride() === 'force';

let quick: Promise<Tier> | null = null;

/** Verdict sans mesure de FPS : permet de ne même pas télécharger les chunks 3D sur un appareil « low ». */
export function quickTier(): Promise<Tier> {
  if (typeof window === 'undefined') return Promise.resolve('low');
  return (quick ??= (async () => {
    const g = await gpuInfo();
    if (gpuOverride() === 'low' || !g.webgl2) return 'low';
    if (!forced() && g.software) return 'low';
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 4;
    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    return coarse ? (memory <= 3 || cores <= 4 ? 'low' : 'mid') : memory < 4 || cores < 4 ? 'mid' : 'high';
  })());
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
    let tier = await quickTier();
    if (tier === 'low') return tier;
    const fps = await measureFps();
    if (fps < 20 && !forced()) return 'low';
    if (fps < 40 && !forced()) tier = down(tier);
    return tier;
  })();
  return cached;
}

/** Diagnostic lisible (commande `gpu` du terminal) : moteur de rendu détecté, mode choisi, niveau retenu. */
export async function gpuDiagnostics() {
  const g = await gpuInfo();
  return { webgl2: g.webgl2, software: g.software, renderer: g.renderer || '—', override: gpuOverride(), tier: await quickTier() };
}
