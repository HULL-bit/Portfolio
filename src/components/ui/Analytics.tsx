'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

type GC = { count: (o: { path: string; title?: string; event?: boolean }) => void };

/**
 * GoatCounter (sans cookie) : pages vues lors des navigations client, et événements de conversion
 * (clic sur tout élément [data-track] : cv-download, email-click, whatsapp-click, linkedin-click, github-click).
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; } // la 1re page vue est comptée par count.js
    (window as unknown as { goatcounter?: GC }).goatcounter?.count({ path: pathname });
  }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (el?.dataset.track) track(el.dataset.track);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}

/** Événement unique à l'affichage d'une page (ex. ouverture de la vue express). */
export function TrackView({ event }: { event: string }) {
  useEffect(() => { track(event); }, [event]);
  return null;
}
