'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BY_SECTION: Record<string, string> = {
  hero: 'indigo', about: 'indigo', stack: 'cyan', experience: 'indigo', projects: 'violet', skills: 'cyan', journey: 'indigo', github: 'indigo', contact: 'gold',
};

/** Îlot minuscule : la teinte du fond suit la section la plus visible (attribut `data-tint` sur <html>). Sur une page projet : violet. */
export function NebulaTint() {
  const pathname = usePathname();
  useEffect(() => {
    const html = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id], .hero'));
    if (!sections.length) { html.dataset.tint = pathname.includes('/projets/') ? 'violet' : 'indigo'; return; }
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.intersectionRatio);
        let best: HTMLElement | null = null;
        let max = 0;
        ratios.forEach((r, el) => { if (r > max) { max = r; best = el as HTMLElement; } });
        if (best) html.dataset.tint = BY_SECTION[(best as HTMLElement).classList.contains('hero') ? 'hero' : (best as HTMLElement).id] ?? 'indigo';
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => { io.disconnect(); delete html.dataset.tint; };
  }, [pathname]);
  return null;
}
