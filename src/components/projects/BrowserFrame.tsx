import type { ReactNode } from 'react';

/**
 * Maquette « navigateur » : la capture (haute) est cadrée en 16/10 ; au survol elle défile lentement
 * de haut en bas pour parcourir la page (CSS pur, pointeurs avec survol uniquement).
 */
export function BrowserFrame({ url, hint, children }: { url: string | null; hint?: string; children: ReactNode }) {
  let host = '';
  if (url) {
    try { host = new URL(url).host; } catch { host = ''; }
  }
  return (
    <figure className="browser">
      <div className="browser-bar" aria-hidden="true">
        <i /><i /><i />
        <span className="browser-url">{host || '—'}</span>
      </div>
      <div className="browser-view">
        {children}
        {hint ? <span className="browse-hint" aria-hidden="true">↕ {hint}</span> : null}
      </div>
    </figure>
  );
}
