import type { ReactNode } from 'react';

/**
 * Maquette « navigateur » : la capture (haute) est cadrée en 16/10 ; au survol elle défile lentement
 * de haut en bas pour parcourir la page (CSS pur, pointeurs avec survol uniquement).
 */
export function BrowserFrame({ url, hint, ratio, children }: { url: string | null; hint?: string; /** Rapport largeur/hauteur de la capture si elle tient dans le cadre (captures d'un seul écran) ; sinon cadre 16/10 qui défile. */ ratio?: number; children: ReactNode }) {
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
      <div className={`browser-view${ratio ? ' is-fit' : ''}`} style={ratio ? { aspectRatio: String(ratio) } : undefined}>
        {children}
        {hint && !ratio ? <span className="browse-hint" aria-hidden="true">↕ {hint}</span> : null}
      </div>
    </figure>
  );
}
