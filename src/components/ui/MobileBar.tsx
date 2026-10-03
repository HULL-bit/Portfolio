'use client';
import { useEffect, useRef, useState } from 'react';
import { siWhatsapp } from 'simple-icons';

type Item = { id: string; label: string; href: string; download?: boolean; track: string; external?: boolean };

const ICON: Record<string, React.ReactNode> = {
  cv: <path d="M12 3v12m-5-4 5 5 5-5M5 20h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  email: <path d="M3 6h18v12H3zM3 7l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  whatsapp: <path d={siWhatsapp.path} fill="currentColor" transform="scale(.9) translate(1.3 1.3)" />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 10v6M8 7.5v.01M12 16v-6m0 3c0-2 1-3 2.6-3S17 11 17 13v3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
};

/** Barre d'action fixe en bas d'écran (mobile) : CV · E-mail · WhatsApp · LinkedIn. Masquée pendant le défilement rapide. */
export function MobileBar({ items, label }: { items: Item[]; label: string }) {
  const [away, setAway] = useState(false);
  const last = useRef({ y: 0, t: 0 });
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    last.current = { y: window.scrollY, t: performance.now() };
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - last.current.y);
      const v = dy / Math.max(1, now - last.current.t);
      last.current = { y: window.scrollY, t: now };
      if (v > 1.4) setAway(true);
      clearTimeout(timer);
      timer = setTimeout(() => setAway(false), 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, []);
  return (
    <nav className={`mobile-bar${away ? ' is-away' : ''}`} aria-label={label}>
      {items.map((it) => (
        <a key={it.id} href={it.href} data-track={it.track} {...(it.download ? { download: true } : {})} {...(it.external ? { target: '_blank', rel: 'noopener' } : {})}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">{ICON[it.id]}</svg>
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
