'use client';
import { useEffect, useState, type ComponentType } from 'react';

/** Monte un composant client après le chargement initial (requestIdleCallback) : hors du chemin critique. */
export function IdleMount({ load, when = true }: { load: () => Promise<ComponentType>; when?: boolean }) {
  const [C, setC] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (!when) return;
    let off = false;
    const run = () => { load().then((c) => { if (!off) setC(() => c); }).catch(() => {}); };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 2500 }) : (setTimeout(run, 1200) as unknown as number);
    return () => { off = true; w.cancelIdleCallback?.(id); };
  }, [load, when]);
  return C ? <C /> : null;
}
