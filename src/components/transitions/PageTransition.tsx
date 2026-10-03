'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { BASE_PATH } from '@/lib/base';
import { FM_EASE, prefersReduced } from '@/lib/motion';
import { runtime } from '@/lib/runtime';
import { Motif } from '@/components/ui/Motif';
import { LogoMark } from '@/components/ui/LogoMark';

type Phase = 'idle' | 'cover' | 'wait';

/**
 * Transition de page « rideau brodé » : un panneau au motif de feston balaie l'écran (clip-path, 0,9 s),
 * le logo se dessine au centre, la route change derrière, puis le rideau se retire vers le haut.
 * Les clics internes sont interceptés en phase de capture (avant next/link) ; reduced-motion : fondu simple.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [reduced, setReduced] = useState(false);
  const target = useRef<string | null>(null);
  const from = useRef(pathname);
  const phaseRef = useRef<Phase>('idle');
  phaseRef.current = phase;

  useEffect(() => setReduced(prefersReduced()), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (phaseRef.current !== 'idle') { e.preventDefault(); e.stopPropagation(); return; }
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // externe ou ancre de la même page
      if (BASE_PATH && !url.pathname.startsWith(BASE_PATH)) return;
      e.preventDefault();
      e.stopPropagation();
      target.current = url.pathname.slice(BASE_PATH.length) + url.search + url.hash;
      from.current = pathname;
      setPhase('cover');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  const go = useCallback(() => {
    if (phaseRef.current !== 'cover' || !target.current) return;
    setPhase('wait');
    router.push(target.current);
  }, [router]);

  // la route a changé : on remonte en haut de page puis on retire le rideau
  useEffect(() => {
    if (phase !== 'wait' || pathname === from.current) return;
    runtime.lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const t = setTimeout(() => setPhase('idle'), 220);
    return () => clearTimeout(t);
  }, [pathname, phase]);

  // garde-fou : jamais bloqué plus de 4 s
  useEffect(() => {
    if (phase === 'idle') return;
    const t = setTimeout(() => setPhase('idle'), 4000);
    return () => clearTimeout(t);
  }, [phase]);

  const present = phase !== 'idle';
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {present ? (
          reduced ? (
            <m.div key="fade" className="curtain curtain-fade" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onAnimationComplete={go} />
          ) : (
            <m.div
              key="curtain"
              className="curtain"
              aria-hidden="true"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.9, ease: FM_EASE.inOut }}
              onAnimationComplete={go}
            >
              <Motif name="feston" variant="circuit" repeat={50} className="curtain-band top" />
              <Motif name="chainette" variant="circuit" repeat={50} className="curtain-band bottom" />
              <Motif name="rosace" variant="circuit" className="curtain-rosace" />
              <LogoMark className="curtain-logo" />
            </m.div>
          )
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
