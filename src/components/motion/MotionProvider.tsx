'use client';
import { useEffect } from 'react';
import { DUR, EASE, STAGGER, finePointer, prefersReduced } from '@/lib/motion';
import { runtime, scrollToTarget } from '@/lib/runtime';

/**
 * Moteur d'animation : Lenis (défilement) + GSAP (ScrollTrigger, SplitText).
 * Chargé dynamiquement après l'hydratation ; sans effet si prefers-reduced-motion.
 * Tout le contenu est déjà dans le HTML : ceci n'est qu'une couche d'amélioration.
 */
export function MotionProvider() {
  useEffect(() => {
    if (prefersReduced()) return;
    let disposed = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
        import('lenis'),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // ── Défilement fluide, synchronisé avec ScrollTrigger ──
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      runtime.lenis = lenis;
      const html = document.documentElement;
      const nav = document.querySelector<HTMLElement>('.nav');
      let lastY = 0;
      lenis.on('scroll', (l: { scroll: number; velocity: number }) => {
        ScrollTrigger.update();
        runtime.velocity = l.velocity;
        const y = l.scroll;
        const goingDown = y > lastY;
        if (nav && !html.classList.contains('menu-open')) nav.classList.toggle('is-hidden', goingDown && y > 140);
        lastY = y;
      });
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // ── Ancres internes : défilement Lenis ──
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        const url = new URL(a.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.querySelector<HTMLElement>(url.hash);
        if (!target) return;
        e.preventDefault();
        history.pushState(null, '', url.hash);
        scrollToTarget(target);
      };
      document.addEventListener('click', onClick);

      const ctxCleanups: (() => void)[] = [];
      const ctx = gsap.context(() => {
        // ── Titres : lettres en cascade ──
        const titles = gsap.utils.toArray<HTMLElement>('[data-title]');
        const eyebrows = gsap.utils.toArray<HTMLElement>('[data-eyebrow]');
        document.fonts.ready.then(() => {
          if (disposed) return;
          titles.forEach((el) => {
            SplitText.create(el, {
              type: 'chars,words',
              mask: 'chars',
              maskClass: 'split-mask',
              autoSplit: true,
              onSplit: (self) => {
                el.style.visibility = 'visible';
                return gsap.from(self.chars, {
                  yPercent: 115,
                  duration: DUR.reveal * 1.15,
                  ease: EASE.out,
                  stagger: STAGGER.chars,
                  scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                });
              },
            });
          });
          // ── Texte : lignes masquées qui montent ──
          gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
            SplitText.create(el.querySelectorAll('p, li').length ? el.querySelectorAll('p, li') : el, {
              type: 'lines',
              mask: 'lines',
              maskClass: 'split-mask',
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 108,
                  duration: DUR.reveal,
                  ease: EASE.out,
                  stagger: STAGGER.lines,
                  scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                  onComplete: () => {
                    // les mots-clés s'allument en cyan après la révélation
                    el.querySelectorAll<HTMLElement>('.kw').forEach((k, i) => gsap.delayedCall(i * 0.14, () => k.classList.add('lit')));
                  },
                }),
            });
          });
          ScrollTrigger.refresh();
        });

        eyebrows.forEach((el) =>
          gsap.from(el, { autoAlpha: 0, x: -24, duration: DUR.reveal * 0.8, ease: EASE.out, scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
        );

        // ── Cartes et blocs : fondu + montée, en cascade par rangée ──
        gsap.set('main .glass, main .photo-wrap', { autoAlpha: 0, y: 48 });
        ScrollTrigger.batch('main .glass, main .photo-wrap', {
          start: 'top 90%',
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: DUR.reveal, ease: EASE.out, stagger: STAGGER.cards, overwrite: true }),
        });

        // ── Compteurs mécaniques : colonnes 0–9 qui défilent ──
        gsap.utils.toArray<HTMLElement>('[data-roll]').forEach((root) => {
          const cols = root.querySelectorAll<HTMLElement>('.roll-col');
          gsap.fromTo(
            cols,
            { yPercent: 0 },
            {
              yPercent: (_i, el: HTMLElement) => -(Number(el.dataset.d) + 10) * 5,
              duration: DUR.count,
              ease: EASE.out,
              stagger: STAGGER.digits,
              scrollTrigger: { trigger: root, start: 'top 90%', once: true },
            },
          );
        });

        // ── Boutons magnétiques ──
        if (finePointer()) {
          const items = gsap.utils.toArray<HTMLElement>('[data-magnetic]').map((el) => ({
            el,
            x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }),
            y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }),
          }));
          const onMove = (e: PointerEvent) => {
            for (const it of items) {
              const r = it.el.getBoundingClientRect();
              const dx = e.clientX - (r.left + r.width / 2);
              const dy = e.clientY - (r.top + r.height / 2);
              const near = Math.abs(dx) < r.width / 2 + 60 && Math.abs(dy) < r.height / 2 + 60;
              it.x(near ? dx * 0.28 : 0);
              it.y(near ? dy * 0.28 : 0);
              it.el.toggleAttribute('data-magnet-on', near);
            }
          };
          window.addEventListener('pointermove', onMove, { passive: true });
          ctxCleanups.push(() => window.removeEventListener('pointermove', onMove));
        }
      });

      (window as unknown as { __motionReady: boolean }).__motionReady = true;
      html.classList.add('lenis');
      requestAnimationFrame(() => ScrollTrigger.refresh());

      teardown = () => {
        ctxCleanups.forEach((f) => f());
        ctx.revert();
        document.removeEventListener('click', onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        runtime.lenis = null;
        html.classList.remove('lenis');
        nav?.classList.remove('is-hidden');
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  return null;
}
