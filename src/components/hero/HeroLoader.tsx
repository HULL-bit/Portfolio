'use client';
import { useEffect, useState, type ComponentType } from 'react';
import { getGpuTier, prefersReducedMotion, quickTier } from '@/lib/gpu-tier';

type Comp = ComponentType<{ tier: 'high' | 'mid'; label: string }>;

/**
 * Charge la scène de particules en import dynamique, en parallèle de la mesure de performance.
 * Aucun WebGL (low), reduced-motion ou échec : le repli HTML/CSS (photo duotone + cadre brodé) reste affiché.
 */
export function HeroLoader({ label }: { label: string }) {
  const [state, setState] = useState<{ C: Comp; tier: 'high' | 'mid' } | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let off = false;
    (async () => {
      if ((await quickTier()) === 'low') return; // pas de téléchargement du chunk 3D inutile
      const chunk = import('@/components/three/HeroParticles'); // le téléchargement démarre pendant la mesure du FPS
      const tier = await getGpuTier();
      if (off || tier === 'low') return;
      const mod = await chunk;
      if (!off) setState({ C: mod.default as Comp, tier });
    })().catch(() => {});
    return () => { off = true; };
  }, []);

  return state ? <state.C tier={state.tier} label={label} /> : null;
}
