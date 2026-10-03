'use client';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { getGpuTier, prefersReducedMotion } from '@/lib/gpu-tier';
import type { RackDomain, RackLabels } from './skills-data';

type RackProps = { domains: RackDomain[]; labels: RackLabels; tier: 'high' | 'mid'; visible: boolean };

/**
 * Charge la baie 3D à l'approche de la section (IntersectionObserver, marge 100 %). Une fois prête, la grille HTML
 * devient « lecteurs d'écran seulement » (classe `skills-3d` sur la section) ; sans WebGL elle reste le rendu visible.
 */
export function SkillsLoader({ domains, labels }: { domains: RackDomain[]; labels: RackLabels }) {
  const host = useRef<HTMLDivElement>(null);
  const [rack, setRack] = useState<{ C: ComponentType<RackProps>; tier: 'high' | 'mid' } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersReducedMotion()) return;
    let off = false;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setVisible(true); } else setVisible(false); },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    const load = async () => {
      const tier = await getGpuTier();
      if (off || tier === 'low') return;
      const mod = await import('@/components/three/SkillsRack');
      if (!off) setRack({ C: mod.default, tier });
    };
    const first = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { first.disconnect(); load().catch(() => {}); } }, { rootMargin: '100% 0px' });
    first.observe(el);
    return () => { off = true; io.disconnect(); first.disconnect(); };
  }, []);

  useEffect(() => {
    const section = host.current?.closest('section');
    section?.classList.toggle('skills-3d', !!rack);
    return () => section?.classList.remove('skills-3d');
  }, [rack]);

  return <div ref={host}>{rack ? <rack.C domains={domains} labels={labels} tier={rack.tier} visible={visible} /> : null}</div>;
}
