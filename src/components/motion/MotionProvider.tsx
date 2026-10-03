'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DUR, EASE, STAGGER, finePointer, prefersReduced } from '@/lib/motion';
import { runtime, scrollToTarget } from '@/lib/runtime';

/**
 * Moteur d'animation : Lenis (défilement) + GSAP (ScrollTrigger, SplitText).
 * Chargé dynamiquement après l'hydratation ; sans effet si prefers-reduced-motion.
 * Tout le contenu est déjà dans le HTML : ceci n'est qu'une couche d'amélioration.
 */
export function MotionProvider() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersReduced()) return;
    let disposed = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

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

      const cleanups: (() => void)[] = [];

      // ── Révélations de blocs, d'étiquettes et de compteurs : CSS + IntersectionObserver ──
      // (des centaines de tweens GSAP coûtaient ~300 ms de thread principal sur mobile ; ici, une classe suffit)
      const reveal = new IntersectionObserver(
        (entries) => {
          let n = 0;
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            el.style.setProperty('--rv-delay', `${(n++ * STAGGER.cards).toFixed(2)}s`);
            el.classList.add('in');
            reveal.unobserve(el);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
      );
      document.querySelectorAll('main .glass, main .photo-wrap, [data-eyebrow], [data-roll]').forEach((el) => reveal.observe(el));
      cleanups.push(() => reveal.disconnect());

      // ── Titres (lettres en cascade) et textes (lignes masquées) : découpés seulement à l'approche de l'écran ──
      let splitText: typeof import('gsap/SplitText').SplitText | null = null;
      const loadSplit = async () => {
        if (splitText) return splitText;
        const mod = await import('gsap/SplitText');
        gsap.registerPlugin(mod.SplitText);
        splitText = mod.SplitText;
        return splitText;
      };
      const show = (el: HTMLElement) => { el.style.visibility = 'visible'; };
      const splitIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            splitIo.unobserve(el);
            Promise.all([loadSplit(), document.fonts.ready])
              .then(([ST]) => {
                if (disposed || !ST) return show(el);
                if (el.hasAttribute('data-title')) {
                  ST.create(el, {
                    type: 'chars,words', mask: 'chars', maskClass: 'split-mask', autoSplit: true,
                    onSplit: (self) => {
                      show(el);
                      return gsap.from(self.chars, { yPercent: 115, duration: DUR.reveal * 1.15, ease: EASE.out, stagger: STAGGER.chars });
                    },
                  });
                } else {
                  const targets = el.querySelectorAll('p, li').length ? el.querySelectorAll('p, li') : el;
                  ST.create(targets, {
                    type: 'lines', mask: 'lines', maskClass: 'split-mask', autoSplit: true,
                    onSplit: (self) =>
                      gsap.from(self.lines, {
                        yPercent: 108, duration: DUR.reveal, ease: EASE.out, stagger: STAGGER.lines,
                        onComplete: () => el.querySelectorAll<HTMLElement>('.kw').forEach((k, i) => setTimeout(() => k.classList.add('lit'), i * 140)),
                      }),
                  });
                }
              })
              .catch(() => show(el)); // si SplitText ne se charge pas, le texte reste visible tel quel
          }
        },
        { rootMargin: '0px 0px 20% 0px' },
      );
      document.querySelectorAll<HTMLElement>('[data-title], [data-lines]').forEach((el) => splitIo.observe(el));
      cleanups.push(() => splitIo.disconnect());
      const ctx = gsap.context(() => {
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
          cleanups.push(() => window.removeEventListener('pointermove', onMove));
        }
      });

      (window as unknown as { __motionReady: boolean }).__motionReady = true;
      html.classList.add('lenis');
      requestAnimationFrame(() => ScrollTrigger.refresh());

      teardown = () => {
        cleanups.forEach((f) => f());
        ctx.revert();
        document.removeEventListener('click', onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
        runtime.lenis = null;
        html.classList.remove('lenis');
        nav?.classList.remove('is-hidden');
      };
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const idle = w.requestIdleCallback ? w.requestIdleCallback(() => { start(); }, { timeout: 1200 }) : (setTimeout(start, 400) as unknown as number);

    return () => {
      disposed = true;
      w.cancelIdleCallback?.(idle);
      teardown?.();
    };
  }, [pathname]);

  return null;
}
