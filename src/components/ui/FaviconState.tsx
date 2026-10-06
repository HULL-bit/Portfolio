'use client';
import { useEffect } from 'react';
import { withBase } from '@/lib/base';

/** Le favicon passe en or quand l'onglet est actif. */
export function FaviconState() {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (!link) return;
    const apply = () => { link.href = withBase(document.hidden ? '/favicon.svg' : '/favicon-gold.svg'); };
    apply();
    document.addEventListener('visibilitychange', apply);
    return () => document.removeEventListener('visibilitychange', apply);
  }, []);
  return null;
}
