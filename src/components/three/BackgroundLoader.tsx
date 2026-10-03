'use client';
import { useEffect, useState, type ComponentType } from 'react';
import { getGpuTier, type Tier } from '@/lib/gpu-tier';

/** Charge le fond shader après l'affichage (requestIdleCallback), uniquement si l'appareil le permet. */
export function BackgroundLoader() {
  const [state, setState] = useState<{ C: ComponentType<{ tier: Tier }>; tier: Tier } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const tier = await getGpuTier();
      if (cancelled || tier === 'low') return;
      const mod = await import('./ShaderBackground');
      if (!cancelled) setState({ C: mod.default, tier });
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 800);
    return () => { cancelled = true; };
  }, []);

  return state ? <state.C tier={state.tier} /> : null;
}
