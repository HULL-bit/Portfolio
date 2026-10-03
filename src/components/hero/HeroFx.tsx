'use client';
import { useEffect } from 'react';
import { prefersReduced } from '@/lib/motion';

/** Le nom se révèle par ScrambleText (01<>/_#) — après le boot s'il y en a un. Le texte final est déjà dans le HTML. */
export function HeroFx({ name }: { name: string }) {
  useEffect(() => {
    if (prefersReduced()) return;
    let off = false;
    const run = async () => {
      const h1 = document.getElementById('hero-name');
      if (!h1 || off) return;
      const [{ gsap }, { ScrambleTextPlugin }] = await Promise.all([import('gsap'), import('gsap/ScrambleTextPlugin')]);
      if (off) return;
      gsap.registerPlugin(ScrambleTextPlugin);
      h1.setAttribute('aria-label', name);
      gsap.to(h1, { duration: 1.1, ease: 'none', scrambleText: { text: name, chars: '01<>/_#', speed: 0.55, revealDelay: 0.15 } });
    };
    if (document.documentElement.classList.contains('booting')) window.addEventListener('diaw:boot-done', run, { once: true });
    else run();
    return () => { off = true; window.removeEventListener('diaw:boot-done', run); };
  }, [name]);
  return null;
}
