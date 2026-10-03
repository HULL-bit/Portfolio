'use client';
import { useEffect } from 'react';
import { quickTier } from '@/lib/gpu-tier';

/** Pose `gpu-ok` sur <html> si l'appareil a un vrai GPU : active flous, filtres et animations décoratives coûteuses. */
export function GpuClasses() {
  useEffect(() => {
    let off = false;
    quickTier().then((t) => { if (!off) document.documentElement.classList.toggle('gpu-ok', t !== 'low'); });
    return () => { off = true; document.documentElement.classList.remove('gpu-ok'); };
  }, []);
  return null;
}
