'use client';
import { useEffect } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Îlot client minuscule : filtres par catégorie et par technologie de la section Projets.
 * Tout le HTML est rendu côté serveur ; ici, délégation d'événements et bascule de l'attribut `hidden` — aucun arbre React à hydrater.
 */
export function ProjectsFilter() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-showcase]');
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-pj]'));
    const count = root.querySelector<HTMLElement>('[data-count]');
    const empty = root.querySelector<HTMLElement>('[data-empty]');
    const others = root.querySelector<HTMLElement>('[data-others]');
    const clear = root.querySelector<HTMLButtonElement>('[data-clear]');
    let cat = 'all';
    let tech: string | null = null;

    const apply = () => {
      let shown = 0;
      let cards = 0;
      for (const el of items) {
        const cats = (el.dataset.cats ?? '').split(' ');
        const stack = (el.dataset.stack ?? '').split('|');
        const ok = (cat === 'all' || cats.includes(cat)) && (!tech || stack.includes(tech));
        el.hidden = !ok;
        if (ok) { shown++; if (el.hasAttribute('data-card')) cards++; }
      }
      root.querySelectorAll<HTMLElement>('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
      root.querySelectorAll<HTMLElement>('[data-tech]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tech === tech)));
      if (clear) {
        clear.hidden = !tech;
        if (tech) { clear.textContent = `${tech} ×`; clear.setAttribute('aria-label', `${clear.dataset.label ?? ''} : ${tech}`); }
      }
      if (count) count.textContent = pad(shown);
      if (empty) empty.hidden = shown > 0;
      if (others) others.hidden = cards === 0;
    };

    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
      if (!btn || !root.contains(btn)) return;
      if (btn.dataset.cat) { cat = btn.dataset.cat; apply(); }
      else if (btn.dataset.tech) { tech = tech === btn.dataset.tech ? null : btn.dataset.tech; apply(); }
      else if (btn.hasAttribute('data-clear')) { tech = null; apply(); }
      else if (btn.hasAttribute('data-reset')) { tech = null; cat = 'all'; apply(); }
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);
  return null;
}
