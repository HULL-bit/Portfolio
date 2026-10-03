'use client';
import { useEffect, useState, type ComponentType } from 'react';
import { finePointer, prefersReduced } from '@/lib/motion';

type Labels = { view: string; open: string; drag: string };

/** Curseur personnalisé : chargé après coup, et seulement pour un pointeur fin. */
export function CursorMount({ labels }: { labels: Labels }) {
  const [C, setC] = useState<ComponentType<{ labels: Labels }> | null>(null);
  useEffect(() => {
    if (!finePointer() || prefersReduced()) return;
    let off = false;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const run = () => import('./Cursor').then((m) => { if (!off) setC(() => m.Cursor); });
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 2500 }); else setTimeout(run, 1200);
    return () => { off = true; };
  }, []);
  return C ? <C labels={labels} /> : null;
}
