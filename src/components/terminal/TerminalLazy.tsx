'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { TerminalData } from './Terminal';

const Terminal = dynamic(() => import('./Terminal').then((m) => m.Terminal), { ssr: false });

/** Le terminal n'est chargé qu'à la première demande (touche ` ou bouton >_) : zéro coût au chargement de la page. */
export function TerminalLazy({ data }: { data: TerminalData }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (armed) return;
    const arm = () => setArmed(true);
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (e.key === '`' && !typing && !e.ctrlKey && !e.metaKey) { e.preventDefault(); arm(); }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('diaw:terminal', arm);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('diaw:terminal', arm); };
  }, [armed]);
  return armed ? <Terminal data={data} initialOpen /> : null;
}
