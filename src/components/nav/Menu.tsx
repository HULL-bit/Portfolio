'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Motif } from '@/components/ui/Motif';
import { runtime } from '@/lib/runtime';

type Item = { id: string; href: string; label: string };
type Props = {
  items: Item[];
  labels: { menu: string; open: string; close: string };
  cv: { href: string; label: string };
  tools?: React.ReactNode;
};

/** Menu plein écran : liens géants sur fond de motif brodé animé. Échap pour fermer, focus géré. */
export function Menu({ items, labels, cv, tools }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const first = useRef<HTMLAnchorElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => { setOpen(false); trigger.current?.focus(); }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('menu-open', open);
    if (open) { runtime.lenis?.stop(); first.current?.focus(); } else runtime.lenis?.start();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); html.classList.remove('menu-open'); };
  }, [open, close]);

  return (
    <>
      <button ref={trigger} type="button" className="btn btn-line btn-sm menu-toggle" aria-expanded={open} aria-controls="menu-overlay" aria-label={open ? labels.close : labels.open} onClick={() => setOpen((o) => !o)}>
        {open ? '×' : labels.menu}
      </button>
      {mounted ? createPortal(
      <div id="menu-overlay" className={`menu-overlay${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label={labels.menu} inert={!open}>
        <Motif name="rosace" variant="circuit" className="menu-rosace" />
        <div className="wrap menu-inner">
          <ul>
            {items.map((it, i) => (
              <li key={it.id} style={{ ['--i' as string]: i }}>
                <Link ref={i === 0 ? first : undefined} href={it.href} onClick={() => setOpen(false)}>
                  <span className="menu-num">{String(i + 1).padStart(2, '0')}</span>{it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu-foot">
            <a className="btn btn-gold" href={cv.href} download data-track="cv-download">{cv.label}</a>
            <div className="nav-tools-inline">{tools}</div>
          </div>
        </div>
      </div>,
        document.body,
      ) : null}
    </>
  );
}
