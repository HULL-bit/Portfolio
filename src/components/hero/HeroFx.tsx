'use client';
import { useEffect } from 'react';
import { prefersReduced } from '@/lib/motion';

/** Le nom se révèle par ScrambleText (01<>/_#) — après le boot s'il y en a un. Le texte final est déjà dans le HTML. */
export function HeroFx() {
  useEffect(() => {
    if (prefersReduced()) return;
    let off = false;
    const run = async () => {
      const h1 = document.getElementById('hero-name');
      if (!h1 || off) return;
      const words = Array.from(h1.querySelectorAll<HTMLElement>('.hn-word'));
      if (!words.length) return;
      const [{ gsap }, { ScrambleTextPlugin }] = await Promise.all([import('gsap'), import('gsap/ScrambleTextPlugin')]);
      if (off) return;
      gsap.registerPlugin(ScrambleTextPlugin);
      // Le vrai texte reste en place (transparent) : il réserve la mise en page. Le scramble se joue sur une couche
      // superposée sans effet sur le flux, sinon les caractères aléatoires changeraient les retours à la ligne (CLS).
      const layers = words.map((w) => {
        const fx = document.createElement('span');
        fx.className = 'hn-fx';
        fx.setAttribute('aria-hidden', 'true');
        fx.textContent = w.textContent;
        w.appendChild(fx);
        return fx;
      });
      h1.classList.add('is-scrambling');
      const done = () => { h1.classList.remove('is-scrambling'); layers.forEach((l) => l.remove()); };
      layers.forEach((fx, i) =>
        gsap.to(fx, {
          duration: 1.1, ease: 'none', delay: i * 0.12,
          scrambleText: { text: words[i]!.firstChild?.textContent ?? '', chars: '01<>/_#', speed: 0.55, revealDelay: 0.15 },
          onComplete: i === layers.length - 1 ? done : undefined,
        }),
      );
    };
    if (document.documentElement.classList.contains('booting')) window.addEventListener('diaw:boot-done', run, { once: true });
    else run();
    return () => { off = true; window.removeEventListener('diaw:boot-done', run); };
  }, []);
  return null;
}
